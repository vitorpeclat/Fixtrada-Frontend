import { AppText, Button } from "@/components";
import api from "@/lib/api";
import { Colors } from "@/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Car, ChevronLeft, Star } from "lucide-react-native";
import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatDate, translateStatus } from "@/utils/formatters";
import { styles } from "./styles";
import type { ServiceItem as BaseServiceItem } from "../Historico/index";

// Extend the type to include the new chatId field
type ServiceItem = BaseServiceItem & {
    chatId?: string | null;
}

// --- Rating Component ---
const StarRatingInput = ({ rating, setRating, disabled = false }: { rating: number, setRating: (r: number) => void, disabled?: boolean }) => {
    return (
        <View style={styles.starRatingContainer}>
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <TouchableOpacity key={starValue} onPress={() => !disabled && setRating(starValue)} disabled={disabled}>
                        <Star
                            size={32}
                            color={Colors.gold}
                            fill={starValue <= rating ? Colors.gold : "none"}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};


function DetalhesServicoContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for evaluation
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServiceDetails = useCallback(async () => {
    if (!serviceId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/services/${serviceId}`);
      if (response.status === 200) {
        setService(response.data);
      } else {
        throw new Error("Erro ao buscar detalhes do serviço");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchServiceDetails();
  }, [fetchServiceDetails]);

  const handleBack = () => router.back();

  const handleFinalizeService = async () => {
    if (!service) return;
    Alert.alert(
      "Finalizar Serviço",
      "Tem certeza que deseja marcar este serviço como concluído?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              const response = await api.patch(`/services/${service.id}/finalize`);
              if (response.status === 200) {
                Alert.alert("Sucesso", "Serviço finalizado com sucesso!");
                setService(prev => prev ? { ...prev, status: "concluído" } : null);
              } else {
                throw new Error(response.data?.message || "Erro ao finalizar serviço");
              }
            } catch (err: any) {
              Alert.alert("Erro", err.response?.data?.message || "Não foi possível finalizar o serviço.");
            }
          },
        },
      ]
    );
  };

  const handleAvaliarServico = async () => {
    if (rating === 0) {
        Alert.alert("Atenção", "Por favor, selecione uma nota (de 1 a 5 estrelas).");
        return;
    }
    if (!service) return;

    setIsSubmitting(true);
    try {
        const response = await api.post(`/cliente/servicos/${service.id}/avaliar`, {
            nota: rating,
            comentario: comment,
        });

        if (response.status === 200) {
            Alert.alert("Sucesso", "Sua avaliação foi enviada!");
            setService(prev => prev ? { ...prev, notaCliente: rating, comentarioCliente: comment } : null);
        } else {
            throw new Error(response.data?.message || "Erro ao enviar avaliação");
        }
    } catch (err: any) {
        Alert.alert("Erro", err.response?.data?.message || "Não foi possível enviar sua avaliação.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleOpenChat = () => {
    if (!service) return;
    if (!service.chatId) {
        Alert.alert("Chat não disponível", "Não há um chat associado a este serviço.");
        return;
    }
    router.push({
      pathname: "/Chat",
      params: { chatId: service.chatId, serviceId: service.id },
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !service) {
    return (
      <View style={styles.centered}>
        <AppText style={{ color: Colors.secondary }}>{error || "Serviço não encontrado"}</AppText>
        <Button title="Voltar" onPress={handleBack} containerStyle={{ marginTop: 16 }} />
      </View>
    );
  }

  const status = translateStatus(service.status);
  const canFinalize = !['concluído', 'cancelado', 'recusado'].includes(service.status);
  const canEvaluate = service.status === 'concluído' && service.notaCliente === null;

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={28} color={Colors.primary} />
        </TouchableOpacity>
        {canFinalize && (
          <Button title="Finalizar Serviço" onPress={handleFinalizeService} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.shopBlock}>
            <Car size={50} color={Colors.darkGray} />
          <View style={styles.shopInfo}>
            <AppText style={styles.shopName}>{service.prestador?.mecLogin || "Prestador"}</AppText>
          </View>
        </View>

        <View style={styles.separator}></View>

        <View style={styles.detailsBlock}>
            <AppText style={styles.serviceItem}>Tipo: <AppText style={styles.serviceItemValue}>{service.tipoServico?.tseTipoProblema || "-"}</AppText></AppText>
            <AppText style={styles.serviceItem}>Data: <AppText style={styles.serviceItemValue}>{formatDate(service.data)}</AppText></AppText>
            <AppText style={styles.serviceItem}>Status: <AppText style={[styles.serviceItemValue, { color: status === 'Pendente' ? Colors.secondary : Colors.primary }]}>{status}</AppText></AppText>
            <AppText style={styles.serviceItem}>Veículo: <AppText style={styles.serviceItemValue}>{service.carro?.carMarca} {service.carro?.carModelo}</AppText></AppText>
            {service.descricao && (
                <View style={styles.descriptionContainer}>
                    <AppText style={styles.descriptionLabel}>Descrição</AppText>
                    <AppText style={styles.descriptionText}>{service.descricao}</AppText>
                </View>
            )}
        </View>

        {canEvaluate && (
            <View style={styles.evaluationBlock}>
                <AppText style={styles.evaluationTitle}>Avalie este serviço</AppText>
                <StarRatingInput rating={rating} setRating={setRating} />
                <TextInput
                    style={styles.commentInput}
                    placeholder="Deixe um comentário (opcional)"
                    value={comment}
                    onChangeText={setComment}
                    multiline
                />
                <Button
                    title={isSubmitting ? "Enviando..." : "Enviar Avaliação"}
                    onPress={handleAvaliarServico}
                    disabled={isSubmitting}
                />
            </View>
        )}

        {service.notaCliente !== null && (
            <View style={styles.evaluationBlock}>
                <AppText style={styles.evaluationTitle}>Sua Avaliação</AppText>
                <StarRatingInput rating={service.notaCliente || 0} setRating={() => {}} disabled={true} />
                {service.comentarioCliente && <AppText style={styles.commentText}>{service.comentarioCliente}</AppText>}
            </View>
        )}

        <Button title="Abrir Chat" onPress={handleOpenChat} containerStyle={{ marginTop: 20 }} />
      </ScrollView>
    </View>
  );
}

export default function DetalhesServicoScreen() {
  return <DetalhesServicoContent />;
}

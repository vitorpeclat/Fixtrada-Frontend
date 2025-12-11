import { AppText, Button } from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Car, ChevronLeft, Star } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, TouchableOpacity, View, Modal, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

// Importar o tipo ServiceItem da tela de histórico
import type { ServiceItem } from "../Historico/index";

// Funções de formatação
function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

function formatCNPJ(cnpj?: string) {
  if (!cnpj) return "-";
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

function translateStatus(status: string) {
  switch (status?.toLowerCase()) {
    case "pendente": return "Pendente";
    case "proposta": return "Proposta";
    case "incompleto": return "Incompleto";
    case "finalizado": return "Finalizado";
    case "concluído": return "Finalizado";
    case "em_andamento": return "Em Andamento";
    case "em andamento": return "Em Andamento";
    default: return status;
  }
}

function DetalhesServicoContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const serviceId = Array.isArray(params.serviceId) ? params.serviceId[0] : params.serviceId;

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.message || `HTTP ${response.status}: Erro ao buscar detalhes do serviço`;
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setService(data);
    } catch (err: any) {
      console.error('Erro ao carregar detalhes:', err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  const onRefresh = useCallback(async () => {
    if (refreshing || loading) return;
    setRefreshing(true);
    try {
      await fetchServiceDetails();
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, loading, serviceId]);

  const handleBack = () => {
    router.back();
  };

  const handleFinalizeService = () => {
    if (!service) return;
    Alert.alert(
      strings.global.attention,
      "Tem certeza que deseja finalizar este serviço?",
      [
        {
          text: strings.global.cancel,
          style: "cancel",
        },
        {
          text: strings.global.continue,
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("userToken");
              const response = await fetch(`${API_BASE_URL}/services/${service.id}/finalize`, {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              });
              if (response.ok) {
                Alert.alert(
                  strings.global.success,
                  "Serviço finalizado com sucesso!"
                );
                // Atualizar o serviço localmente
                setService({ ...service, status: "finalizado" });
              } else {
                Alert.alert(strings.global.error, "Erro ao finalizar serviço");
              }
            } catch (error) {
              Alert.alert(strings.global.error, "Erro ao finalizar serviço");
            }
          },
        },
      ]
    );
  };

  const handleOpenChat = () => {
    if (!service || !service.chatID) return;
    router.push({
      pathname: "/Chat",
      params: { chatId: service.chatID },
    });
  };

  const handleRateService = () => {
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (!service || rating === 0) {
      Alert.alert(strings.global.error, "Por favor, selecione uma nota de 0.5 a 5.");
      return;
    }

    try {
      setSubmittingRating(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/cliente/servicos/${service.id}/avaliar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nota: rating,
          comentario: comment || undefined,
        }),
      });

      if (response.ok) {
        Alert.alert(strings.global.success, "Avaliação enviada com sucesso!");
        setShowRatingModal(false);
        setRating(0);
        setComment("");
        // Atualizar o serviço localmente
        setService({ ...service, notaCliente: rating, comentarioCliente: comment });
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert(strings.global.error, errorData?.message || "Erro ao enviar avaliação");
      }
    } catch (error) {
      Alert.alert(strings.global.error, "Erro ao enviar avaliação");
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <AppText style={{ marginTop: 16 }}>Carregando detalhes...</AppText>
      </View>
    );
  }

  if (error || !service) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <AppText style={{ color: Colors.secondary, textAlign: "center" }}>
          {error || "Serviço não encontrado"}
        </AppText>
        <Button title="Voltar" onPress={handleBack} containerStyle={{ marginTop: 16 }} />
      </View>
    );
  }

  const status = translateStatus(service.status);
  const statusLower = service.status?.toLowerCase();
  const showFinalizeButton = statusLower === "pendente" || statusLower === "proposta";
  const showRateButton = statusLower === "concluído" && !service.notaCliente;
  const hasChatID = !!service.chatID;

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={28} color={Colors.primary} />
          <AppText style={styles.backButtonText}>
            {strings.global.back}
          </AppText>
        </TouchableOpacity>

        {/* Botão "Finalizar Serviço" visível para status "Pendente" ou "Proposta" */}
        {showFinalizeButton && (
          <Button
            title="Finalizar Serviço"
            onPress={handleFinalizeService}
            containerStyle={styles.finalizeButton}
            textStyle={styles.finalizeButtonText}
          />
        )}
        
        {/* Botão "Avaliar Serviço" visível para status "Em Andamento" */}
        {showRateButton && (
          <Button
            title="Avaliar Serviço"
            onPress={handleRateService}
            containerStyle={styles.rateButton}
            textStyle={styles.rateButtonText}
          />
        )}
      </View>

      {/* Conteúdo da Página */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingTop: insets.top + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]} // Android
            tintColor={Colors.primary} // iOS
          />
        }
      >
        {/* Bloco da Oficina/Prestador */}
        <View style={styles.shopBlock}>
          <View style={styles.logoPlaceholder}>
            <Car size={50} color={Colors.darkGray} />
          </View>
          <View style={styles.shopInfo}>
            <AppText style={styles.shopName}>
              {service.prestador?.mecLogin ? service.prestador.mecLogin : "Mecânica Não Associada"}
            </AppText>
            {!service.prestador && (
              <AppText style={styles.shopSubtext}>
                Esperando a mecânica enviar proposta
              </AppText>
            )}
            {service.prestador?.mecCNPJ && (
              <AppText style={styles.shopDetail}>
                CNPJ: {formatCNPJ(service.prestador?.mecCNPJ)}
              </AppText>
            )}
            {service.prestador?.mecNota && (
              <View style={styles.shopRatingContainer}>
                <AppText style={styles.shopRatingText}>
                  Nota: {service.prestador.mecNota.toFixed(1)}
                </AppText>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    color={Colors.gold}
                    fill={i < Math.floor(service.prestador?.mecNota || 0) ? Colors.gold : "none"}
                    style={styles.starIcon}
                  />
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Separador */}
        <View style={styles.separator}></View>

        {/* Bloco da Ordem de Serviço */}
        <View style={styles.orderBlock}>
          <AppText style={styles.orderNumber}>
            Ordem de serviço N° {service.codigo || "Não informado"}
          </AppText>
        </View>

        {/* Detalhes do Veículo e Serviço */}
        <View style={styles.detailsBlock}>
          <View style={styles.vehicleHeader}>
            <Car size={30} color={Colors.secondary} />
            <AppText style={styles.vehicleName}>
              {service.carro?.carMarca} {service.carro?.carModelo} {service.carro?.carAno ? `(${service.carro.carAno})` : ""} - {service.carro?.carPlaca}
            </AppText>
          </View>
          <AppText style={styles.serviceItem}>
            Tipo de serviço:{" "}
            <AppText style={styles.serviceItemValue}>
              {service.tipoServico?.tseTipoProblema || "-"}
            </AppText>
          </AppText>
          <AppText style={styles.serviceItem}>
            Data:{" "}
            <AppText style={styles.serviceItemValue}>
              {formatDate(service.data)}
            </AppText>
          </AppText>
          <AppText style={styles.serviceItem}>
            Status:{" "}
            <AppText
              style={[
                styles.serviceItemValue,
                { color: statusLower === "pendente" ? Colors.secondary : Colors.primary },
              ]}
            >
              {status}
            </AppText>
          </AppText>
          <AppText style={styles.serviceItem}>
            Valor:{" "}
            <AppText style={styles.serviceItemValue}>
              {service.valor 
                ? `R$ ${Number(service.valor).toFixed(2).replace('.', ',')}` 
                : "Não informado"}
            </AppText>
          </AppText>

          {/* Descrição do Problema */}
          {service.descricao && (
            <View style={styles.descriptionContainer}>
              <AppText style={styles.descriptionLabel}>Descrição</AppText>
              <AppText style={styles.descriptionText}>
                {service.descricao}
              </AppText>
            </View>
          )}
        </View>

        {/* Botão Abrir Chat */}
        <Button
          title="Abrir Chat"
          onPress={handleOpenChat}
          disabled={!hasChatID}
          containerStyle={[
            styles.openChatButton,
            !hasChatID && styles.openChatButtonDisabled
          ]}
          textStyle={[
            styles.openChatButtonText,
            !hasChatID && styles.openChatButtonTextDisabled
          ]}
        />
      </ScrollView>

      {/* Modal de Avaliação */}
      <Modal
        visible={showRatingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText style={styles.modalTitle}>Avaliar Serviço</AppText>
            
            {/* Estrelas de Avaliação */}
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => {
                const isFullFilled = star <= rating;
                const isHalfFilled = star - 0.5 === rating;
                
                return (
                  <View key={star} style={styles.starWrapper}>
                    {/* Estrela base (vazia) */}
                    <View style={styles.starBase}>
                      <Star
                        size={45}
                        color={Colors.gold}
                        fill="none"
                        strokeWidth={2}
                      />
                    </View>
                    
                    {/* Camada de preenchimento */}
                    <View style={[
                      styles.starFillOverlay,
                      { width: isFullFilled ? '100%' : isHalfFilled ? '50%' : '0%' }
                    ]}>
                      <Star
                        size={45}
                        color={Colors.gold}
                        fill={Colors.gold}
                        strokeWidth={2}
                      />
                    </View>
                    
                    {/* Áreas clicáveis invisíveis */}
                    <TouchableOpacity
                      style={styles.starTouchLeft}
                      onPress={() => setRating(star - 0.5)}
                      activeOpacity={1}
                    />
                    <TouchableOpacity
                      style={styles.starTouchRight}
                      onPress={() => setRating(star)}
                      activeOpacity={1}
                    />
                  </View>
                );
              })}
            </View>
            
            {/* Exibir nota selecionada */}
            {rating > 0 && (
              <AppText style={styles.ratingText}>
                Nota: {rating.toFixed(1)} estrela{rating !== 1 ? "s" : ""}
              </AppText>
            )}

            {/* Campo de Comentário */}
            <AppText style={styles.commentLabel}>Comentário (opcional)</AppText>
            <TextInput
              style={styles.commentInput}
              placeholder="Deixe seu comentário sobre o serviço..."
              placeholderTextColor={Colors.gray}
              multiline
              numberOfLines={4}
              maxLength={500}
              value={comment}
              onChangeText={setComment}
              textAlignVertical="top"
            />

            {/* Botões */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowRatingModal(false);
                  setRating(0);
                  setComment("");
                }}
              >
                <AppText style={styles.cancelButtonText}>Cancelar</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitRating}
                disabled={submittingRating}
              >
                {submittingRating ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <AppText style={styles.submitButtonText}>Enviar</AppText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Componente principal para exportar
export default function DetalhesServicoScreen() {
  return <DetalhesServicoContent />;
}
import { AppText, Button } from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Car, ChevronLeft, Star } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from "react-native";
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
    case "incompleto": return "Incompleto";
    case "finalizado": return "Finalizado";
    case "em andamento": return "Em Andamento";
    default: return status;
  }
}

function DetalhesServicoContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { serviceId } = useLocalSearchParams();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          throw new Error("Erro ao buscar detalhes do serviço");
        }
        const data = await response.json();
        setService(data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

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
    if (!service) return;
    router.push({
      pathname: "/Chat",
      params: { serviceId: service.id },
    });
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
  const isPending = status === "Pendente" || status === "Incompleto";

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

        {/* Botão "Finalizar Serviço" visível apenas se o status for "Incompleto" ou "Pendente" */}
        {isPending && (
          <Button
            title="Finalizar Serviço"
            onPress={handleFinalizeService}
            containerStyle={styles.finalizeButton}
            textStyle={styles.finalizeButtonText}
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
      >
        {/* Bloco da Oficina/Prestador */}
        <View style={styles.shopBlock}>
          <View style={styles.logoPlaceholder}>
            <Car size={50} color={Colors.darkGray} />
          </View>
          <View style={styles.shopInfo}>
            <AppText style={styles.shopName}>
              {service.prestador?.mecLogin || "Prestador não informado"}
            </AppText>
            <AppText style={styles.shopDetail}>
              CNPJ: {formatCNPJ(service.prestador?.mecCNPJ)}
            </AppText>
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
                { color: isPending ? Colors.secondary : Colors.primary },
              ]}
            >
              {status}
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
          containerStyle={styles.openChatButton}
          textStyle={styles.openChatButtonText}
        />
      </ScrollView>
    </View>
  );
}

// Componente principal para exportar
export default function DetalhesServicoScreen() {
  return <DetalhesServicoContent />;
}
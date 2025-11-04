import { AppText, Button } from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { Car, ChevronLeft, Star } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles"; // Estilos no próximo arquivo

// Tipo para o status do serviço
type ServiceStatus = "Incompleto" | "Finalizado" | "Em Andamento";

// Dados de exemplo para o serviço (você receberia isso via props ou API)
const mockServiceDetails = {
  shopName: "AUTOREPAIR",
  shopSlogan: "your slogan here",
  shopCnpj: "12.345.678/0001-90",
  shopAddress: "Avenida placeholder n°289",
  shopRating: 5.0,
  orderNumber: "0019202893",
  vehicleName: "FUSCA 1980 AMARELO",
  serviceType: "Elétrico",
  status: "Incompleto" as ServiceStatus, // Estado inicial "Incompleto"
  description:
    "Toda a parte elétrica do carro esta comprometida, quando eu ligo o farol o pisca alerta é acionado junto.",
};

function DetalhesServicoContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Estado mutável do status do serviço para demonstrar a funcionalidade
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>(
    mockServiceDetails.status
  );

  const handleBack = () => {
    router.back();
  };

  const handleFinalizeService = () => {
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
          onPress: () => {
            // Lógica para chamar a API e finalizar o serviço
            // Após sucesso:
            Alert.alert(
              strings.global.success,
              "Serviço finalizado com sucesso!"
            );
            setServiceStatus("Finalizado"); // Atualiza o estado para "Finalizado"
          },
        },
      ]
    );
  };

  const handleOpenChat = () => {
    Alert.alert("Abrir Chat", "Navegar para a tela de chat com a oficina.");
    //router.push("/Chat");
  };

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

        {/* Botão "Finalizar Serviço" visível apenas se o status for "Incompleto" */}
        {serviceStatus === "Incompleto" && (
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
          { paddingTop: insets.top + 80 }, // Espaço para o header flutuante
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Bloco da Oficina */}
        <View style={styles.shopBlock}>
          {/* Logo Placeholder - Substitua por <Image /> */}
          <View style={styles.logoPlaceholder}>
            <Car size={50} color={Colors.darkGray} />
          </View>
          <View style={styles.shopInfo}>
            <AppText style={styles.shopName}>{mockServiceDetails.shopName}</AppText>
            <AppText style={styles.shopSlogan}>
              {mockServiceDetails.shopSlogan}
            </AppText>
            <AppText style={styles.shopDetail}>
              CNPJ: {mockServiceDetails.shopCnpj}
            </AppText>
            <AppText style={styles.shopDetail}>
              {mockServiceDetails.shopAddress}
            </AppText>
            <View style={styles.shopRatingContainer}>
              <AppText style={styles.shopRatingText}>
                Nota: {mockServiceDetails.shopRating.toFixed(1)}
              </AppText>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  color={Colors.gold} // Cor da estrela
                  fill={i < mockServiceDetails.shopRating ? Colors.gold : "none"} // Preenche estrelas cheias
                  style={styles.starIcon}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Separador */}
        <View style={styles.separator}></View>

        {/* Bloco da Ordem de Serviço */}
        <View style={styles.orderBlock}>
          <AppText style={styles.orderNumber}>
            Ordem de serviço nº {mockServiceDetails.orderNumber}
          </AppText>
        </View>

        {/* Detalhes do Veículo e Serviço */}
        <View style={styles.detailsBlock}>
          <View style={styles.vehicleHeader}>
            <Car size={30} color={Colors.secondary} />
            <AppText style={styles.vehicleName}>
              {mockServiceDetails.vehicleName}
            </AppText>
          </View>
          <AppText style={styles.serviceItem}>
            Tipo de serviço:{" "}
            <AppText style={styles.serviceItemValue}>
              {mockServiceDetails.serviceType}
            </AppText>
          </AppText>
          <AppText style={styles.serviceItem}>
            Status:{" "}
            <AppText
              style={[
                styles.serviceItemValue,
                serviceStatus === "Incompleto" && { color: Colors.secondary }, // Cor laranja para Incompleto
                serviceStatus === "Finalizado" && { color: Colors.primary }, // Cor azul para Finalizado
              ]}
            >
              {serviceStatus}
            </AppText>
          </AppText>

          {/* Descrição do Problema */}
          <View style={styles.descriptionContainer}>
            <AppText style={styles.descriptionLabel}>Descrição</AppText>
            <AppText style={styles.descriptionText}>
              {mockServiceDetails.description}
            </AppText>
          </View>
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
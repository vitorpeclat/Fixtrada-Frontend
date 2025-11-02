import { AppText, Button } from "@/components"; // Reutilizando seus componentes
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles"; // Estilos para esta tela (abaixo)

// Definindo o tipo Vehicle (baseado no HomeContent que você enviou)
type Vehicle = {
  carID?: string;
  carPlaca?: string;
  carMarca?: string;
  carModelo?: string;
  carAno?: number;
  carCor?: string;
  carKM?: number;
  carTpCombust?: string;
  carOpTracao?: string;
  carOpTrocaOleo?: string;
  carOpTrocaPneu?: string;
  carOpRevisao?: string;
  carAtivo?: boolean;
  fk_usuario_usuID?: string;
};

function VeiculosClienteContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);

  // Lógica de busca de veículos (reutilizada da HomeContent)
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoadingVehicles(true);
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          throw new Error("Token não encontrado");
        }

        const res = await fetch(`${API_BASE_URL}/vehicles`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erro ${res.status}: ${text}`);
        }

        const data = await res.json();
        setVehicles(Array.isArray(data) ? data : []);
        setVehiclesError(null);
      } catch (err: any) {
        console.warn("Erro ao buscar veículos:", err);
        setVehiclesError(err?.message ?? String(err));
        setVehicles([]);
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleNewVehicle = () => {
    // Você pode ajustar essa rota se necessário
    router.push("/CadastroVeiculo");
  };

  const handleDetails = (vehicleId?: string) => {
    if (!vehicleId) return;
    // Navega para a tela de detalhes (exemplo)
    Alert.alert("Ver Detalhes", `Implementar navegação para o veículo ID: ${vehicleId}`);
    // router.push(`/(tabs)/profile/veiculo/${vehicleId}`);
  };

  // Renderiza o conteúdo da lista
  const renderContent = () => {
    if (loadingVehicles) {
      return (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (vehiclesError) {
      return (
        <View style={styles.feedbackContainer}>
          <AppText style={styles.errorText}>
            Erro ao carregar veículos: {vehiclesError}
          </AppText>
        </View>
      );
    }

    if (vehicles.length === 0) {
      return (
        <View style={styles.feedbackContainer}>
          <AppText style={styles.emptyText}>
            Nenhum veículo cadastrado.
          </AppText>
        </View>
      );
    }

    return vehicles.map((v) => (
      <View key={v.carID} style={styles.card}>
        <View style={styles.cardInfo}>
          <View style={styles.infoRow}>
            <AppText style={styles.cardLabel}>
              {strings.cadastroVeiculo.marcaLabel}:
            </AppText>
            <AppText style={styles.cardValue}>{v.carMarca || "-"}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText style={styles.cardLabel}>
              {strings.cadastroVeiculo.modeloLabel}:
            </AppText>
            <AppText style={styles.cardValue}>{v.carModelo || "-"}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText style={styles.cardLabel}>
              {strings.cadastroVeiculo.anoLabel}:
            </AppText>
            <AppText style={styles.cardValue}>{v.carAno || "-"}</AppText>
          </View>
        </View>
        <Button
          title="Mais detalhes"
          icon={<Plus size={18} color={Colors.white} />}
          onPress={() => handleDetails(v.carID)}
          containerStyle={styles.detailsButton}
          textStyle={styles.detailsButtonText}
        />
      </View>
    ));
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
        <Button
          title="Cadastrar novo veículo"
          onPress={handleNewVehicle}
          containerStyle={styles.newVehicleButton}
          textStyle={styles.newVehicleButtonText}
        />
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
        <AppText style={styles.title}>
          {strings.profile.registeredVehicles}
        </AppText>

        {renderContent()}
      </ScrollView>
    </View>
  );
}

// Exportação principal da tela
export default function VeiculosClienteScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <VeiculosClienteContent />
    </GestureHandlerRootView>
  );
}
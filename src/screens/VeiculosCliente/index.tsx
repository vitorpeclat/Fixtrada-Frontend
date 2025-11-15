import { AppText, Button } from "@/components"; // Reutilizando seus componentes
import type { Vehicle } from "@/contexts/VehiclesContext";
import { useVehicles } from "@/contexts/VehiclesContext";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles"; // Estilos para esta tela (abaixo)

// Vehicle type centralizado em VehiclesContext

function VeiculosClienteContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { vehicles, loading: loadingVehicles, error: vehiclesError, reload } = useVehicles();
  const [refreshing, setRefreshing] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleNewVehicle = () => {
    // Você pode ajustar essa rota se necessário
    router.push("/CadastroVeiculo");
  };

  const handleDetails = (vehicleId?: string) => {
    if (!vehicleId) return;
    router.push({ pathname: "/DetalhesVeiculo", params: { id: vehicleId } });
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

    return vehicles.map((v: Vehicle) => (
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              if (refreshing || loadingVehicles) return;
              setRefreshing(true);
              try {
                await reload();
              } finally {
                setRefreshing(false);
              }
            }}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
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
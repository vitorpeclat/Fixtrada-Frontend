import { AppText } from "@/components";
import { useVehicles, type Vehicle } from "@/contexts/VehiclesContext";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, Car, ChevronLeft, Droplet, Edit3, Gauge, Settings, Wrench } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

// estilos migrados para styles.ts

function InfoRow({ 
  icon: Icon, 
  label, 
  value, 
  isLast = false,
  isDate = false 
}: { 
  icon: any; 
  label: string; 
  value?: string | number | boolean | null;
  isLast?: boolean;
  isDate?: boolean;
}) {
  let parsed = value === null || value === undefined || value === "" ? "-" : String(value);
  
  // Formatar data se for uma data ISO (YYYY-MM-DD)
  if (isDate && parsed !== "-" && /^\d{4}-\d{2}-\d{2}/.test(parsed)) {
    // Evitar fuso horário: usar split ao invés de Date()
    const [y,m,d] = parsed.split("-");
    parsed = `${d}/${m}/${y}`;
  }
  
  return (
    <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
      <View style={styles.iconContainer}>
        <Icon size={20} color={Colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <AppText style={styles.cardLabel}>{label}</AppText>
        <AppText style={styles.cardValue}>{parsed}</AppText>
      </View>
    </View>
  );
}

function DetalhesVeiculoContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { vehicles, loading, error, reload } = useVehicles();

  const vehicle: Vehicle | undefined = useMemo(
    () => vehicles.find((v) => v.carID === params.id),
    [vehicles, params.id]
  );

  useEffect(() => {
    if (!vehicle && !loading) reload();
  }, [vehicle, loading, reload]);

  const handleBack = () => router.back();
  const handleEdit = () => {
    if (!vehicle?.carID) return;
    router.push({ pathname: "/UpdateVeiculo" as any, params: { id: vehicle.carID } });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={28} color={Colors.primary} />
          <AppText style={styles.backButtonText}>{strings.global.back}</AppText>
        </TouchableOpacity>
        {vehicle && (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Edit3 size={16} color={Colors.white} />
            <AppText style={styles.editButtonText}>Editar</AppText>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 70 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading && !vehicle ? (
          <View style={styles.feedbackContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.feedbackContainer}>
            <AppText style={styles.errorText}>{error}</AppText>
          </View>
        ) : !vehicle ? (
          <View style={styles.feedbackContainer}>
            <AppText style={styles.emptyText}>Veículo não encontrado.</AppText>
          </View>
        ) : (
          <>
            <View style={styles.headerCard}>
              <Car size={48} color={Colors.primary} style={styles.vehicleIcon} />
              <AppText style={styles.title}>{vehicle.carMarca} {vehicle.carModelo}</AppText>
              <AppText style={styles.subtitle}>{vehicle.carPlaca || "Sem placa"}</AppText>
            </View>

            <View style={styles.card}>
              <AppText style={styles.sectionTitle}>Informações Básicas</AppText>
              <InfoRow icon={Car} label={strings.cadastroVeiculo.marcaLabel} value={vehicle.carMarca} />
              <InfoRow icon={Car} label={strings.cadastroVeiculo.modeloLabel} value={vehicle.carModelo} />
              <InfoRow icon={Calendar} label={strings.cadastroVeiculo.anoLabel} value={vehicle.carAno} />
              <InfoRow icon={Droplet} label={strings.cadastroVeiculo.corLabel} value={vehicle.carCor} isLast />
            </View>

            <View style={styles.card}>
              <AppText style={styles.sectionTitle}>Especificações</AppText>
              <InfoRow icon={Gauge} label={strings.cadastroVeiculo.kmLabel} value={vehicle.carKM} />
              <InfoRow icon={Droplet} label={strings.cadastroVeiculo.combustivelLabel} value={vehicle.carTpCombust} />
              <InfoRow icon={Settings} label={strings.cadastroVeiculo.tracaoLabel} value={vehicle.carOpTracao} isLast />
            </View>

            <View style={styles.card}>
              <AppText style={styles.sectionTitle}>Manutenções</AppText>
              <InfoRow icon={Wrench} label={strings.cadastroVeiculo.trocaOleoLabel} value={vehicle.carOpTrocaOleo} isDate />
              <InfoRow icon={Wrench} label={strings.cadastroVeiculo.trocaPneuLabel} value={vehicle.carOpTrocaPneu} isDate />
              <InfoRow icon={Calendar} label={strings.cadastroVeiculo.revisaoLabel} value={vehicle.carOpRevisao} isDate isLast />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

export default function DetalhesVeiculoScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DetalhesVeiculoContent />
    </GestureHandlerRootView>
  );
}

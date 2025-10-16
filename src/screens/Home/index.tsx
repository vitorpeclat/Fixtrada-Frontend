import { AppText, Button } from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { Car, Menu } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

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

function HomeContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoadingVehicles(true);
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          setVehiclesError("Token não encontrado");
          setVehicles([]);
          return;
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

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(openDrawer)();
    });

  return (
    <GestureDetector gesture={flingGesture}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.headerIcon, { top: insets.top + 10 }]}
          onPress={openDrawer}
          activeOpacity={0.7}
        >
          <Menu size={45} color={Colors.primary} />
        </TouchableOpacity>
        <Button
          title="Ajuda"
          onPress={() => router.push("/Help")}
          backgroundColor={Colors.background}
          borderColor={Colors.primary}
          textColor={Colors.primary}
          borderWidth={2}
          containerStyle={{
            position: "absolute",
            top: insets.top + 10,
            right: 20,
            zIndex: 50,
            width: "auto",
            paddingHorizontal: 15,
          }}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{
            ...styles.contentContainer,
            paddingTop: insets.top + 70,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentSection}>
            <View style={styles.card}>
              <Car size={48} color={Colors.primary} style={styles.cardIcon} />
              <AppText style={styles.cardTitle}>
                {strings.home.cardTitle}
              </AppText>
              <AppText style={styles.cardSubtitle}>
                {strings.home.cardSubtitle}
              </AppText>
              <Button
                title={strings.home.scheduleServiceButton}
                onPress={() => router.push("/SolicitarServico")}
                containerStyle={{ width: "100%" }}
              />
            </View>
          </View>

          <View style={styles.contentSection}>
            <View style={styles.card}>
              <AppText style={styles.cardTitle}>
                Meus Veículos ({vehicles.length})
              </AppText>

              {loadingVehicles ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : vehiclesError ? (
                <AppText style={{ color: "red" }}>{vehiclesError}</AppText>
              ) : vehicles.length === 0 ? (
                <AppText>Nenhum veículo cadastrado</AppText>
              ) : (
                vehicles.map((v: any, idx: number) => {
                  const placa = v.carPlaca ?? "-";
                  const marca = v.carMarca ?? "-";
                  const modelo = v.carModelo ?? "-";
                  const key = v.carID ?? idx.toString();

                  return (
                    <View key={key} style={styles.vehicleCard}>
                      <View style={styles.vehicleIconContainer}>
                        <Car size={36} color={Colors.primary} />
                      </View>
                      <View style={styles.vehicleInfoContainer}>
                        <View style={styles.vehicleDataRow}>
                          <AppText style={styles.vehicleDataLabel}>
                            Placa:
                          </AppText>
                          <AppText style={styles.vehicleDataValue}>
                            {placa}
                          </AppText>
                        </View>
                        <View style={styles.vehicleDataRow}>
                          <AppText style={styles.vehicleDataLabel}>
                            Marca:
                          </AppText>
                          <AppText style={styles.vehicleDataValue}>
                            {marca}
                          </AppText>
                        </View>
                        <View style={styles.vehicleDataRow}>
                          <AppText style={styles.vehicleDataLabel}>
                            Modelo:
                          </AppText>
                          <AppText style={styles.vehicleDataValue}>
                            {modelo}
                          </AppText>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </GestureDetector>
  );
}

export default function HomeScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HomeContent />
    </GestureHandlerRootView>
  );
}

import { AppText, Button } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { useVehicles } from "@/contexts/VehiclesContext";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { Car, Menu } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
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


function HomeContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { vehicles, loading: loadingVehicles, error: vehiclesError, reload } = useVehicles();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) reload();
  }, [isAuthenticated]);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(openDrawer)();
    });

  const onRefresh = useCallback(async () => {
    if (refreshing || loadingVehicles) return;
    setRefreshing(true);
    try {
      await reload();
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, loadingVehicles, reload]);

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
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{
            ...styles.contentContainer,
            paddingTop: insets.top + 70,
          }}
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

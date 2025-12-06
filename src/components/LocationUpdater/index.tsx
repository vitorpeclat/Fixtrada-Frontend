import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useRef } from "react";

import { API_BASE_URL } from "@/config/ip";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Envia a latitude/longitude do cliente para o backend a cada 2 minutos.
 * Só roda para usuários autenticados com role "cliente".
 */
export function LocationUpdater() {
  const { user } = useAuth();
  const isSyncing = useRef(false);

  useEffect(() => {
    if (!user || user.role !== "cliente") return;

    const syncLocation = async () => {
      if (isSyncing.current) return;
      isSyncing.current = true;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

        await fetch(`${API_BASE_URL}/cliente/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        });
      } catch (error) {
        console.warn("Falha ao sincronizar localização", error);
      } finally {
        isSyncing.current = false;
      }
    };

    // primeira execução imediata
    syncLocation();
    const intervalId = setInterval(syncLocation, 120000); // 2 minutos

    return () => {
      clearInterval(intervalId);
    };
  }, [user]);

  return null;
}

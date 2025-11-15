import { useAuth } from '@/contexts/AuthContext';
import { DrawerActions } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useNavigation } from 'expo-router';
import { Menu } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';

import api from '@/lib/api';
import { Colors } from '@/theme/colors';

interface Prestador {
  cnpj: string;
  login: string;
  nota: number | null;
  latitude: number | null;
  longitude: number | null;
  distancia: number;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  useEffect(() => {
    if (location && isAuthenticated) {
      fetchNearbyPrestadores(
        location.coords.latitude,
        location.coords.longitude
      );
    }
  }, [location, isAuthenticated]);

  const fetchNearbyPrestadores = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await api.get('/prestadores/nearby', {
        params: {
          latitude,
          longitude,
          raioKm: 10, // ou um valor dinâmico
        },
      });
      setPrestadores(response.data);
    } catch (error) {
      console.error('Failed to fetch nearby prestadores:', error);
      setErrorMsg('Failed to fetch nearby providers.');
    } finally {
      setLoading(false);
    }
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text>Loading Map...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
          {prestadores.map((prestador) => {
            if (prestador.latitude && prestador.longitude) {
              return (
                <Marker
                  key={prestador.cnpj}
                  coordinate={{
                    latitude: prestador.latitude,
                    longitude: prestador.longitude,
                  }}
                  title={prestador.login}
                  description={`Nota: ${prestador.nota || 'N/A'}`}
                />
              );
            }
            return null;
          })}
        </MapView>
      )}
      <TouchableOpacity
        style={[styles.headerIcon, { top: insets.top + 10 }]}
        onPress={openDrawer}
        activeOpacity={0.7}
      >
        <Menu size={45} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
});
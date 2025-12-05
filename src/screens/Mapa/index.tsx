import { AppText } from "@/components";
import { GOOGLE_MAPS_API_KEY } from "@/config/apiKeys";
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { DrawerActions, useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { MapPin, Menu, Star } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

type Prestador = {
  mecCNPJ: string;
  mecLogin: string | null;
  mecNota: number | null;
  mecEnderecoNum: string | null;
  mecAtivo: boolean;
  mecFoto: string | null;
  latitude: number | null;
  longitude: number | null;
  fk_endereco_endCEP: string | null;
};

type Coord = { latitude: number; longitude: number };

function MapaContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);

  const [userLocation, setUserLocation] = useState<Coord | null>(null);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [loading, setLoading] = useState(false);
  const [geocodingProgress, setGeocodingProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCNPJ, setSelectedCNPJ] = useState<string | null>(null);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(7);
  const [showAll, setShowAll] = useState<boolean>(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const requestLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      const coord = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setUserLocation(coord);
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            ...coord,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          600
        );
      }, 200);
    } catch (e) {
      // ignore
    }
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const geocodeAddress = async (cep: string, numero?: string | null): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const cleanCEP = cep.replace(/\D/g, '');
      if (cleanCEP.length !== 8) {
        console.log('CEP inválido:', cep);
        return null;
      }

      console.log('Geocodificando:', cep, numero);

      const viaCepRes = await axios.get(`https://viacep.com.br/ws/${cleanCEP}/json/`, { timeout: 5000 });
      if (viaCepRes.data.erro) {
        console.log('CEP não encontrado no ViaCEP:', cep);
        return null;
      }

      const { logradouro, bairro, localidade, uf } = viaCepRes.data;
      
      if (!logradouro) {
        console.log('CEP sem logradouro detalhado:', cep);
      }

      const addressParts = [
        logradouro,
        numero,
        bairro,
        localidade,
        uf,
        'Brasil'
      ].filter(Boolean);
      const addressQuery = addressParts.join(', ');
      const components = [
        `country:BR`,
        `postal_code:${cleanCEP}`,
        localidade ? `locality:${localidade}` : null,
        uf ? `administrative_area:${uf}` : null,
        logradouro ? `route:${logradouro}` : null,
      ].filter(Boolean).join('|');
      
      console.log('Endereço para geocodificação:', addressQuery);

      await sleep(200);

      const googleRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: addressQuery || `${cleanCEP}, Brasil`,
          components,
          region: 'br',
          key: GOOGLE_MAPS_API_KEY,
        },
        timeout: 10000
      });

      if (googleRes.data.status === 'OK' && googleRes.data.results.length > 0) {
        const location = googleRes.data.results[0].geometry.location;
        const coords = {
          latitude: location.lat,
          longitude: location.lng,
        };
        console.log('Coordenadas encontradas:', cep, coords);
        return coords;
      } else {
        console.log('Google não encontrou coordenadas. Status:', googleRes.data.status);
        return null;
      }
    } catch (error) {
      console.warn('Erro ao geocodificar endereço:', cep, numero, error);
      return null;
    }
  };

  const fetchPrestadores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/prestadores?ativo=true&limit=200&offset=0`;
      console.log('Buscando prestadores de:', url);
      const res = await axios.get<Prestador[]>(url);
      const data = res.data || [];
      console.log('Prestadores recebidos:', data.length);
      
      const normalized = data.map((p) => {
        const lat = typeof p.latitude === 'string' ? parseFloat(p.latitude) : p.latitude;
        const lon = typeof p.longitude === 'string' ? parseFloat(p.longitude) : p.longitude;
        return { 
          ...p, 
          latitude: isFinite(lat as number) ? lat : null, 
          longitude: isFinite(lon as number) ? lon : null 
        } as Prestador;
      });

      console.log('Prestadores com coordenadas existentes:', normalized.filter(p => p.latitude && p.longitude).length);
      console.log('Prestadores sem coordenadas:', normalized.filter(p => !p.latitude || !p.longitude).length);

      const withCoords: Prestador[] = [];
      const toGeocode = normalized.filter(p => !p.latitude && !p.longitude && p.fk_endereco_endCEP);
      let geocoded = 0;
      
      for (const p of normalized) {
        if (typeof p.latitude === 'number' && typeof p.longitude === 'number') {
          withCoords.push(p);
          continue;
        }
        
        if (p.fk_endereco_endCEP) {
          geocoded++;
          setGeocodingProgress(`Localizando ${geocoded}/${toGeocode.length}...`);
          const coords = await geocodeAddress(p.fk_endereco_endCEP, p.mecEnderecoNum);
          if (coords) {
            withCoords.push({ ...p, ...coords });
          } else {
            withCoords.push(p);
          }
        } else {
          withCoords.push(p);
        }
      }

      setGeocodingProgress(null);

      const valid = withCoords.filter((p) => typeof p.latitude === 'number' && typeof p.longitude === 'number');

      const keyFor = (lat: number, lon: number) => `${lat.toFixed(6)}_${lon.toFixed(6)}`;
      const groups = new Map<string, Prestador[]>();
      for (const p of valid) {
        const key = keyFor(p.latitude as number, p.longitude as number);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(p);
      }

      const radius = 0.00008;
      const separated: Prestador[] = [];
      for (const [key, arr] of groups) {
        if (arr.length === 1) {
          separated.push(arr[0]);
          continue;
        }
        const baseLat = arr[0].latitude as number;
        const baseLon = arr[0].longitude as number;
        arr.forEach((p, idx) => {
          const angle = (idx * 2 * Math.PI) / arr.length;
          const offLat = baseLat + Math.cos(angle) * radius;
          const offLon = baseLon + Math.sin(angle) * radius;
          separated.push({ ...p, latitude: offLat, longitude: offLon });
        });
      }

      console.log('Prestadores válidos para exibir no mapa (separados):', separated.length);
      setPrestadores(separated);
    } catch (err: any) {
      console.error('Erro ao carregar prestadores:', err);
      setError("Falha ao carregar prestadores");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    requestLocation();
    fetchPrestadores();
  }, [requestLocation, fetchPrestadores]);

  const distanceKm = useCallback((a: Coord, b: Coord) => {
    const R = 6371;
    const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
    const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
    const la1 = (a.latitude * Math.PI) / 180;
    const la2 = (b.latitude * Math.PI) / 180;
    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);
    const h = sinDLat * sinDLat + Math.cos(la1) * Math.cos(la2) * sinDLon * sinDLon;
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return R * c;
  }, []);

  const sortedPrestadores = useMemo(() => {
    if (!userLocation) {
      return prestadores;
    }
    const withDist = prestadores
      .filter((p) => typeof p.latitude === 'number' && typeof p.longitude === 'number')
      .map((p) => ({
        ...p,
        _dist: distanceKm(userLocation, { latitude: p.latitude as number, longitude: p.longitude as number }),
      })) as (Prestador & { _dist: number })[];
    withDist.sort((a, b) => a._dist - b._dist);
    if (showAll) return withDist.slice(0, 200);
    return withDist.filter((p) => p._dist <= maxDistanceKm).slice(0, 50);
  }, [prestadores, userLocation, distanceKm, maxDistanceKm, showAll]);

  const centerOn = useCallback((coord: Coord, cnpj?: string) => {
    setSelectedCNPJ(cnpj ?? null);
    mapRef.current?.animateToRegion(
      {
        ...coord,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      400
    );
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.headerIcon, { top: insets.top + 10 }]}
        onPress={openDrawer}
        activeOpacity={0.7}
      >
        <Menu size={45} color={Colors.primary} />
      </TouchableOpacity>
      <View style={[styles.contentContainer, { paddingTop: insets.top + 60 }]}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1, width: '100%' }}
            initialRegion={{
              latitude: userLocation?.latitude ?? -23.5505,
              longitude: userLocation?.longitude ?? -46.6333,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {sortedPrestadores.map((p) => (
              <Marker
                key={p.mecCNPJ}
                coordinate={{
                  latitude: p.latitude as number,
                  longitude: p.longitude as number,
                }}
                title={p.mecLogin ?? "Prestador"}
                description={
                  p.fk_endereco_endCEP
                    ? `CEP ${p.fk_endereco_endCEP}${p.mecEnderecoNum ? ", Nº " + p.mecEnderecoNum : ""}`
                    : undefined
                }
                onPress={() => {
                  if (selectedCNPJ === p.mecCNPJ) {
                    router.push({
                      pathname: "/DetalhesMecanica" as any,
                      params: { cnpj: p.mecCNPJ },
                    });
                  } else {
                    centerOn(
                      { latitude: p.latitude as number, longitude: p.longitude as number },
                      p.mecCNPJ
                    );
                  }
                }}
              />
            ))}
          </MapView>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={useMemo(() => ["14%", "38%", "85%"], [])}
          enablePanDownToClose={false}
          index={0}
          handleStyle={{ backgroundColor: Colors.background }}
          backgroundStyle={{ backgroundColor: Colors.background }}
        >
          <View style={styles.sheetHeader}>
            <AppText style={styles.sheetTitle}>Prestadores próximos</AppText>
            <View style={styles.radiusFilterContainer}>
              {[3,5,7,10].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[styles.radiusPill, maxDistanceKm === val && styles.radiusPillActive]}
                  onPress={() => { setMaxDistanceKm(val); setShowAll(false); }}
                >
                  <AppText style={[styles.radiusPillText, maxDistanceKm === val && styles.radiusPillTextActive]}>
                    {val} km
                  </AppText>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                key={'all'}
                style={[styles.radiusPill, showAll && styles.radiusPillActive]}
                onPress={() => setShowAll((prev) => !prev)}
              >
                <AppText style={[styles.radiusPillText, showAll && styles.radiusPillTextActive]}>
                  {showAll ? 'Filtrar' : 'Todos'}
                </AppText>
              </TouchableOpacity>
            </View>
            {geocodingProgress ? (
              <AppText style={styles.sheetSubtitle}>{geocodingProgress}</AppText>
            ) : loading ? (
              <AppText style={styles.sheetSubtitle}>Carregando…</AppText>
            ) : error ? (
              <AppText style={[styles.sheetSubtitle, { color: Colors.error }]}> {error} </AppText>
            ) : sortedPrestadores.length === 0 && userLocation && !showAll ? (
              <AppText style={styles.sheetSubtitle}>Nenhum prestador em até {maxDistanceKm} km</AppText>
            ) : (
              <AppText style={styles.sheetSubtitle}>
                {showAll ? `${sortedPrestadores.length} total` : `${sortedPrestadores.length} dentro de ${maxDistanceKm} km`}
              </AppText>
            )}
          </View>
          <BottomSheetFlatList<Prestador & { _dist?: number }>
            data={sortedPrestadores as (Prestador & { _dist?: number })[]}
            keyExtractor={(item: Prestador) => item.mecCNPJ}
            renderItem={({ item }: { item: Prestador & { _dist?: number } }) => {
              const dist = userLocation
                ? distanceKm(userLocation, {
                    latitude: item.latitude as number,
                    longitude: item.longitude as number,
                  })
                : undefined;
              return (
                <TouchableOpacity
                  style={[
                    styles.card,
                    selectedCNPJ === item.mecCNPJ && { borderColor: Colors.primary },
                  ]}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/DetalhesMecanica" as any,
                      params: { cnpj: item.mecCNPJ },
                    })
                  }
                >
                  <View style={styles.cardAvatarWrap}>
                    {item.mecFoto ? (
                      <Image source={{ uri: item.mecFoto }} style={styles.cardAvatar} />
                    ) : (
                      <View style={styles.cardAvatarFallback}>
                        <MapPin color={Colors.white} size={20} />
                      </View>
                    )}
                  </View>
                  <View style={styles.cardBody}>
                    <AppText style={styles.cardTitle}>
                      {item.mecLogin ?? "Prestador"}
                    </AppText>
                    <View style={styles.cardRow}>
                      <Star size={16} color={Colors.warning} />
                      <AppText style={styles.cardMeta}>
                        {item.mecNota?.toFixed(1) ?? "N/A"}
                      </AppText>
                      {typeof dist === "number" && (
                        <AppText style={styles.cardMeta}>
                          • {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}
                        </AppText>
                      )}
                    </View>
                    {item.fk_endereco_endCEP && (
                      <AppText style={styles.cardAddress}>
                        CEP {item.fk_endereco_endCEP}
                        {item.mecEnderecoNum ? `, Nº ${item.mecEnderecoNum}` : ""}
                      </AppText>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.sheetList}
          />
        </BottomSheet>
      </View>
    </View>
  );
}

export default function MapaScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MapaContent />
    </GestureHandlerRootView>
  );
}

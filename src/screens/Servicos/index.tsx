import { AppText, Button } from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { DrawerActions, useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Car, MapPin, Menu, Star } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, TouchableOpacity, View, useWindowDimensions } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

type ActiveTab = "oferta" | "mapa";

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

function ServicosContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<ActiveTab>("oferta");
  const router = useRouter();
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const mapRef = useRef<MapView | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);

  const [userLocation, setUserLocation] = useState<Coord | null>(null);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCNPJ, setSelectedCNPJ] = useState<string | null>(null);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(7); // raio configurável
  const [showAll, setShowAll] = useState<boolean>(false); // ignora raio

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    translateX.value = withTiming(tab === "oferta" ? 0 : -width, {
      duration: 300,
    });
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const flingRightGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      if (activeTab === "mapa") {
        runOnJS(handleTabChange)("oferta");
      } else {
        runOnJS(openDrawer)();
      }
    });

  const flingLeftGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      if (activeTab === "oferta") {
        runOnJS(handleTabChange)("mapa");
      }
    });

  const composedGesture = Gesture.Race(flingRightGesture, flingLeftGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

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
      // Center map when available
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

  const fetchPrestadores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/prestadores?ativo=true&limit=200&offset=0`;
      const res = await axios.get<Prestador[]>(url);
      const normalized = (res.data || []).map((p) => {
        const lat = typeof p.latitude === 'string' ? parseFloat(p.latitude) : p.latitude;
        const lon = typeof p.longitude === 'string' ? parseFloat(p.longitude) : p.longitude;
        return { ...p, latitude: isFinite(lat as number) ? lat : null, longitude: isFinite(lon as number) ? lon : null } as Prestador;
      });
      const valid = normalized.filter((p) => typeof p.latitude === 'number' && typeof p.longitude === 'number');
      setPrestadores(valid);
    } catch (err: any) {
      setError("Falha ao carregar prestadores");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Preload location and providers when user visits the map tab first time
    if (activeTab === "mapa") {
      requestLocation();
      fetchPrestadores();
    }
  }, [activeTab, requestLocation, fetchPrestadores]);

  // Haversine distance in km
  const distanceKm = useCallback((a: Coord, b: Coord) => {
    const R = 6371; // km
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
      // Sem localização ainda: retorna todos sem filtrar raio, mantendo ordem original
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
    // Expand list a bit to show details
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.headerIcon, { top: insets.top + 10 }]}
          onPress={openDrawer}
          activeOpacity={0.7}
        >
          <Menu size={45} color={Colors.primary} />
        </TouchableOpacity>
        <View style={[styles.contentContainer, { paddingTop: insets.top + 60 }]}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabChange("oferta")}
            >
              <AppText
                style={[
                  styles.tabText,
                  activeTab === "oferta" && styles.activeTabText,
                ]}
              >
                {strings.services.valueOfferTab}
              </AppText>
              {activeTab === "oferta" && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabChange("mapa")}
            >
              <AppText
                style={[
                  styles.tabText,
                  activeTab === "mapa" && styles.activeTabText,
                ]}
              >
                {strings.services.mapTab}
              </AppText>
              {activeTab === "mapa" && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          </View>

          <View style={{ width: width, overflow: 'hidden', flex: 1 }}>
            <Animated.View style={[styles.bodyContainer, { width: width * 2 }, animatedStyle]}>
              <View style={[styles.tabContent, { width: width }]}> 
                <Car
                  size={150}
                  color={Colors.secondary}
                  strokeWidth={1.5}
                  style={styles.carImage}
                />
                <AppText style={styles.messageText}>
                  {strings.services.noServiceRequested}
                </AppText>
                <Button
                  title={strings.services.requestServiceButton}
                  onPress={() => router.push("/SolicitarServico")}
                  containerStyle={styles.button}
                />
              </View>
              <View style={[styles.tabContent, { width: width }]}> 
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
                        pinColor={selectedCNPJ === p.mecCNPJ ? Colors.primary : undefined}
                        onPress={() =>
                          centerOn(
                            { latitude: p.latitude as number, longitude: p.longitude as number },
                            p.mecCNPJ
                          )
                        }
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
                    {loading ? (
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
                            centerOn(
                              { latitude: item.latitude as number, longitude: item.longitude as number },
                              item.mecCNPJ
                            )
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
            </Animated.View>
          </View>
        </View>
      </View>
    </GestureDetector>
  );
}

export default function ServicosScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ServicosContent />
    </GestureHandlerRootView>
  );
}

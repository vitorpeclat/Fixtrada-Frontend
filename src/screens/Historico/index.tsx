import { AppText, Button } from "@/components";
import api from "@/lib/api";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { DrawerActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Car, Menu } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

// Helper functions
function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

function translateStatus(status: string) {
  switch (status?.toLowerCase()) {
    case "pendente": return "Pendente";
    case "aceito": return "Aceito";
    case "recusado": return "Recusado";
    case "em_andamento": return "Em Andamento";
    case "concluído": return "Concluído";
    case "cancelado": return "Cancelado";
    default: return status;
  }
}

export type ServiceItem = {
  id: string;
  codigo?: string | null;
  status: string;
  descricao?: string | null;
  data?: string;
  hora?: string;
  valor?: number | string | null;
  notaCliente?: number | null;
  comentarioCliente?: string | null;
  carro?: { carID: string; carPlaca?: string; carMarca?: string; carModelo?: string; carAno?: number; };
  tipoServico?: { tseID: string; tseTipoProblema: string; };
  prestador?: { mecCNPJ: string; mecLogin?: string; };
};

function HistoricoContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/services");
      if (response.status !== 200) {
        throw new Error("Erro ao buscar serviços");
      }
      const data = response.data;
      setServices(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [fetchServices])
  );

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(openDrawer)();
    });

  const handleDetailsPress = (item: ServiceItem) => {
    router.push({
      pathname: "/DetalhesServico",
      params: { serviceId: item.id },
    });
  };

  return (
    <GestureDetector gesture={flingGesture}>
      <View style={styles.container}>
        <View style={[styles.headerContainer, { top: insets.top }]}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={openDrawer}
            activeOpacity={0.7}
          >
            <Menu size={45} color={Colors.primary} />
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>
            {strings.drawerMenu.history}
          </AppText>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={[
            styles.scrollContentContainer,
            { paddingTop: insets.top + 70 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <AppText style={{ textAlign: "center", marginTop: 32 }}>Carregando...</AppText>
          ) : error ? (
            <AppText style={{ color: Colors.secondary, textAlign: "center", marginTop: 32 }}>{error}</AppText>
          ) : services.length === 0 ? (
            <AppText style={{ textAlign: "center", marginTop: 32 }}>Nenhum serviço encontrado.</AppText>
          ) : (
            services.map((item, idx) => {
              const status = translateStatus(item.status);
              const isPending = status === "Pendente" || status === "Incompleto";
              const buttonStyle = isPending ? styles.detailsButtonPending : styles.detailsButton;
              const buttonTextStyle = isPending ? styles.detailsButtonTextPending : styles.detailsButtonText;

              return (
                <View key={item.id || idx} style={styles.card}>
                  <View style={styles.logoPlaceholder}>
                    <Car size={36} color={Colors.darkGray} />
                  </View>
                  <View style={styles.infoContainer}>
                    <AppText style={styles.cardTitle}>
                      {item.tipoServico?.tseTipoProblema || "Tipo de serviço não informado"}
                    </AppText>
                    <AppText style={styles.cardDate}>
                      Veículo: {item.carro?.carMarca || "-"} {item.carro?.carModelo || "-"} {item.carro?.carAno ? `(${item.carro.carAno})` : ""}
                    </AppText>
                    <AppText style={styles.cardDate}>
                      {item.data ? formatDate(item.data) : "-"}
                    </AppText>
                    <AppText
                      style={[
                        styles.cardStatus,
                        { color: isPending ? Colors.secondary : Colors.primary },
                      ]}
                    >
                      Status: {status}
                    </AppText>
                    <Button
                      title="Abrir detalhes"
                      onPress={() => handleDetailsPress(item)}
                      containerStyle={buttonStyle}
                      textStyle={buttonTextStyle}
                    />
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </GestureDetector>
  );
}

export default function HistoricoScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HistoricoContent />
    </GestureHandlerRootView>
  );
}

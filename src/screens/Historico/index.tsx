import { AppText, Button } from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { styles } from "./styles"; // O arquivo de estilos permanece o mesmo
// Função para formatar data (YYYY-MM-DD para DD/MM/YYYY)
function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

// Função para formatar hora ISO para HH:mm
function formatTime(iso?: string) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

// Função para formatar CNPJ
function formatCNPJ(cnpj?: string) {
  if (!cnpj) return "-";
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

// Função para formatar CEP
function formatCEP(cep?: string) {
  if (!cep) return "-";
  return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
}

// Função para formatar valor em reais
function formatBRL(value: number | string | null | undefined) {
  if (value == null) return "-";
  const num = typeof value === "number" ? value : Number(value);
  if (isNaN(num)) return "-";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Função para traduzir status
function translateStatus(status: string) {
  switch (status?.toLowerCase()) {
    case "pendente": return "Pendente";
    case "incompleto": return "Incompleto";
    case "finalizado": return "Finalizado";
    case "em andamento": return "Em Andamento";
    default: return status;
  }
}

// Novo tipo de dados para um serviço retornado pela API
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
  carro?: {
    carID: string;
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
    carFavorito?: boolean;
    fk_usuario_usuID?: string;
  };
  tipoServico?: {
    tseID: string;
    tseTipoProblema: string;
  };
  prestador?: {
    mecCNPJ: string;
    mecNota?: number;
    mecEnderecoNum?: number;
    mecLogin?: string;
    mecAtivo?: boolean;
    mecFoto?: string | null;
    mecVerificado?: boolean;
    fk_endereco_endCEP?: string;
  };
};

function HistoricoContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter(); // Instancia o router

  // Estado para armazenar os serviços
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setError("Usuário não autenticado.");
        setServices([]);
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao buscar serviços");
      }
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [fetchServices])
  );

  // Função para abrir o drawer
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Gesto de arrastar para abrir o drawer
  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(openDrawer)();
    });

  // Função ATUALIZADA para navegar
  const handleDetailsPress = (item: ServiceItem) => {
    // Navega para a tela DetalhesServico
    // Passando o ID do serviço como parâmetro
    router.push({
      pathname: "/DetalhesServico",
      params: { serviceId: item.id },
    });
  };

  return (
    <GestureDetector gesture={flingGesture}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={openDrawer}
            activeOpacity={0.7}
          >
            <Menu size={30} color={Colors.primary} />
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>
            {strings.drawerMenu.history}
          </AppText>
        </View>

        {/* Conteúdo da Página */}
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
                  {/* Logo Placeholder - Substitua por <Image /> */}
                  <View style={styles.logoPlaceholder}>
                    <Car size={36} color={Colors.darkGray} />
                  </View>

                  {/* Informações detalhadas do serviço */}
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

// Exportação principal da tela
export default function HistoricoScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HistoricoContent />
    </GestureHandlerRootView>
  );
}
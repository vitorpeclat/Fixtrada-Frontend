import { AppText, Button } from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router"; // Importa o useRouter
import { Car, Menu } from "lucide-react-native";
import React from "react";
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

// Tipo de dados para um item do histórico
type HistoryItem = {
  id: string;
  shopName: string;
  vehicleName: string;
  date: string;
  status: "Incompleto" | "Finalizado" | "Em Andamento";
  // Substitua 'any' pela sua URI de imagem quando tiver
  logo?: any;
};

// Dados de exemplo baseados na sua imagem
const mockHistoryData: HistoryItem[] = [
  {
    id: "1",
    shopName: "AUTOREPAIR",
    vehicleName: "Gol 2011",
    date: "13 de jun. · 17:55",
    status: "Incompleto",
  },
  {
    id: "2",
    shopName: "MECHANIC",
    vehicleName: "Fusca 1980",
    date: "23 de fev. · 19:34",
    status: "Finalizado",
  },
  {
    id: "3",
    shopName: "MECHANIC",
    vehicleName: "Fusca 1980",
    date: "23 de fev. · 19:34",
    status: "Finalizado",
  },
  {
    id: "4",
    shopName: "MECHANIC",
    vehicleName: "Fusca 1980",
    date: "23 de fev. · 19:34",
    status: "Finalizado",
  },
];

function HistoricoContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter(); // Instancia o router

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
  const handleDetailsPress = (item: HistoryItem) => {
    // Navega para a tela DetalhesServico
    // Passando o ID do serviço como parâmetro
    router.push({
      pathname: "/DetalhesServico", // Certifique-se que este é o caminho correto no seu 'app' dir
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
            { paddingTop: insets.top + 70 }, // Espaço para o header
          ]}
          showsVerticalScrollIndicator={false}
        >
          {mockHistoryData.map((item) => {
            const isPending = item.status === "Incompleto";
            const buttonStyle = isPending
              ? styles.detailsButtonPending
              : styles.detailsButton;
            const buttonTextStyle = isPending
              ? styles.detailsButtonTextPending
              : styles.detailsButtonText;

            return (
              <View key={item.id} style={styles.card}>
                {/* Logo Placeholder - Substitua por <Image /> */}
                <View style={styles.logoPlaceholder}>
                  <Car size={36} color={Colors.darkGray} />
                </View>

                {/* Informações */}
                <View style={styles.infoContainer}>
                  <AppText style={styles.cardTitle}>
                    {item.shopName} – {item.vehicleName}
                  </AppText>
                  <AppText style={styles.cardDate}>{item.date}</AppText>
                  <AppText
                    style={[
                      styles.cardStatus,
                      { color: isPending ? Colors.secondary : Colors.primary },
                    ]}
                  >
                    Status: {item.status}
                  </AppText>
                  <Button
                    title="Abrir detalhes"
                    onPress={() => handleDetailsPress(item)} // Ação de navegação
                    containerStyle={buttonStyle}
                    textStyle={buttonTextStyle}
                  />
                </View>
              </View>
            );
          })}
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
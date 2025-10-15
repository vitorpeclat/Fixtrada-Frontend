// app/Servicos/index.tsx

import { AppText, Button } from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Car, Menu } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { useRouter } from "expo-router";

type ActiveTab = "oferta" | "historico";

function ServicosContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<ActiveTab>("oferta");
  const router = useRouter();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(openDrawer)();
    });

  const renderContent = () => {
    if (activeTab === "oferta") {
      return (
        <View style={styles.bodyContainer}>
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
            onPress={() => console.log("Solicitar Serviço")}
            containerStyle={styles.button}
          />
        </View>
      );
    }
    // Conteúdo para a aba "Histórico" (pode ser implementado depois)
    return (
      <View style={styles.bodyContainer}>
        <AppText style={styles.messageText}>
          Seu histórico de serviços aparecerá aqui.
        </AppText>
      </View>
    );
  };

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
            zIndex: 10,
            width: "auto",
            paddingHorizontal: 15,
          }}
        />

        <View style={[styles.contentContainer, { paddingTop: insets.top + 60 }]}>
          <View style={styles.tabsContainer}>
            {/* Aba Oferta de Valor */}
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("oferta")}
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

            {/* Aba Histórico */}
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("historico")}
            >
              <AppText
                style={[
                  styles.tabText,
                  activeTab === "historico" && styles.activeTabText,
                ]}
              >
                {strings.services.historyTab}
              </AppText>
              {activeTab === "historico" && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          </View>

          {renderContent()}
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

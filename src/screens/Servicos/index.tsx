import { AppText, Button } from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Car, Menu } from "lucide-react-native";
import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

type ActiveTab = "oferta" | "mapa";

function ServicosContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<ActiveTab>("oferta");
  const router = useRouter();
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);

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

          <Animated.View style={[styles.bodyContainer, animatedStyle]}>
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
              <AppText style={styles.messageText}>
                Mapa
              </AppText>
            </View>
          </Animated.View>
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

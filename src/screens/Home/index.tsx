import { AppText, Button } from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Car, Menu } from "lucide-react-native";
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

function HomeContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(openDrawer)();
    });

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

        <View style={styles.content}>
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
              onPress={() => console.log("Iniciar fluxo de agendamento")}
              containerStyle={{ width: "100%" }}
            />
          </View>
        </View>
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

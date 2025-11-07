// app/(tabs)/Perfil/index.tsx

import { AppText, Button } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  Car, // <-- ADICIONADO
  Lock,
  Menu,
  User,
  UserRound,
} from "lucide-react-native"; // <-- 'Menu' ADICIONADO
import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

function PerfilContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const { isAuthenticated, user, reloadUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Atualiza dados no contexto quando autenticado (evita usar AsyncStorage direto)
  useEffect(() => {
    if (isAuthenticated) reloadUser();
  }, [isAuthenticated]);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(openDrawer)();
    });

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await reloadUser();
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, reloadUser]);

  return (
    <GestureDetector gesture={flingGesture}>
      <View style={styles.container}>
        {/* --- HEADER (IGUAL A HOME) --- */}
        <TouchableOpacity
          style={[styles.headerIcon, { top: insets.top + 10 }]}
          onPress={openDrawer}
          activeOpacity={0.7}
        >
          <Menu size={45} color={Colors.primary} />
        </TouchableOpacity>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingTop: insets.top + 70 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <UserRound size={80} color={Colors.darkGray} />
            </View>
          </View>

          <Animatable.View animation="fadeIn" duration={600}>
            <AppText style={styles.userName}>{user?.nome ?? ""}</AppText>
            <AppText style={styles.userEmail}>{user?.email ?? ""}</AppText>

            <View style={styles.divider} />

            <View style={styles.buttonsContainer}>
              <Button
                title={strings.profile.personalData}
                onPress={() => router.push("/DadosPessoais")}
                containerStyle={styles.button}
                textStyle={styles.buttonText}
                icon={<User size={30} color={Colors.primary} />}
                iconPosition="top"
              />
              <Button
                title={strings.profile.vehicles}
                onPress={() => router.push("/VeiculosCliente")}
                containerStyle={styles.button}
                textStyle={styles.buttonText}
                icon={<Car size={30} color={Colors.primary} />}
                iconPosition="top"
              />
              <Button
                title={strings.profile.security}
                onPress={() => router.push("/Seguranca")}
                containerStyle={styles.button}
                textStyle={styles.buttonText}
                icon={<Lock size={30} color={Colors.primary} />}
                iconPosition="top"
              />
            </View>
          </Animatable.View>
        </ScrollView>
      </View>
    </GestureDetector>
  );
}

export default function PerfilScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PerfilContent />
    </GestureHandlerRootView>
  );
}
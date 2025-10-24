// app/(tabs)/Perfil/index.tsx

import { AppText, Button } from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  Car, // <-- ADICIONADO
  Lock,
  Menu,
  User,
  UserRound,
} from "lucide-react-native"; // <-- 'Menu' ADICIONADO
import React, { useEffect, useState } from "react";
import {
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
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const raw = await AsyncStorage.getItem("userData");
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const userName = parsed.nome;
        const userEmail = parsed.email;
        setNome(userName);
        setEmail(userEmail);
      } catch (e) {
        console.error("Erro ao recuperar userData do AsyncStorage:", e);
      }
    };
    fetchUserData();
  }, []);

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
        {/* --- HEADER (IGUAL A HOME) --- */}
        <TouchableOpacity
          style={[styles.headerIcon, { top: insets.top + 10 }]}
          onPress={openDrawer}
          activeOpacity={0.7}
        >
          <Menu size={45} color={Colors.primary} />
        </TouchableOpacity>
        <Button
          title={strings.profile.help}
          onPress={() => router.push("/Help")}
          containerStyle={{
            position: "absolute",
            top: insets.top + 10,
            right: 20,
            zIndex: 50,
            width: "auto",
            paddingHorizontal: 15,
          }}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingTop: insets.top + 70 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <UserRound size={80} color={Colors.darkGray} />
            </View>
          </View>

          <Animatable.View animation="fadeIn" duration={600}>
            <AppText style={styles.userName}>{nome}</AppText>
            <AppText style={styles.userEmail}>{email}</AppText>

            <View style={styles.divider} />

            <View style={styles.buttonsContainer}>
              <Button
                title={strings.profile.personalData}
                onPress={() => router.navigate("/DadosPessoais")}
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
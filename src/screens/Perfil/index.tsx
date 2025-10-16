// app/Perfil/index.tsx

import { AppText, Button, Input, KeyboardShiftView } from "@/components"; // <-- IMPORTAÇÕES ADICIONADAS
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { FilterStatus } from "@/types/FilterStatus"; // <-- IMPORTAÇÃO ADICIONADA
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Menu, Pencil, Star, UserRound, X } from "lucide-react-native"; // <-- ÍCONE X ADICIONADO
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable"; // <-- IMPORTAÇÃO ADICIONADA
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

function PerfilContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(
    FilterStatus.HIDE
  );
  const [erroData, setErroData] = useState("");

  const ratingOpacity = useSharedValue(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const raw = await AsyncStorage.getItem("userData");
        if (!raw) return;
        const parsed = JSON.parse(raw);

        // Campos de acordo com o userData: { id, email, nome, role, telefone }
        const userId = parsed.id;
        const userName = parsed.nome;
        const userEmail = parsed.email;
        const userPhone = parsed.telefone;

        // dataNascimento vem como: YYYY-MM-DD
        let birth = parsed.dataNascimento;
        if (birth) {
          //2003-01-24 or 2003-01-24T00:00:00Z
          const isoMatch = birth.match(/^(\d{4})-(\d{2})-(\d{2})/);
          if (isoMatch) {
            const [, y, m, d] = isoMatch;
            birth = `${d}/${m}/${y}`;
          }
        }
        setNome(userName);
        setEmail(userEmail);
        setDataNascimento(birth);
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

  const handleToggleEdit = () => {
    setIsEditing((prev) => {
      ratingOpacity.value = withTiming(prev ? 1 : 0, { duration: 300 });
      return !prev;
    });
    if (isEditing) {
      setSenha("");
      setConfirmarSenha("");
    }
  };

  const handleSaveChanges = async () => {
    console.log("[Perfil] handleSaveChanges called");
    try {
      // basic validation: nome present
      if (!nome || nome.trim().length === 0) {
        Alert.alert(strings.global.validationError, "Nome é obrigatório");
        return;
      }

      // format date DD/MM/YYYY -> YYYY-MM-DD if provided
      const dataFormatter = (dado: string) => {
        if (!dado || dado.split("/").length !== 3) return undefined;
        const [dia, mes, ano] = dado.split("/");
        return `${ano}-${mes}-${dia}`;
      };
      console.log("Data formatada:", dataFormatter(dataNascimento));
      const payload: Record<string, any> = {};
      if (typeof nome !== "undefined") payload.nome = nome;
      const formatted = dataFormatter(dataNascimento);
      if (formatted) payload.dataNascimento = formatted;
      if (Object.keys(payload).length === 0) {
        Alert.alert(
          strings.profile.saveSuccessTitle,
          strings.profile.saveSuccessMessage
        );
        setIsEditing(false);
        ratingOpacity.value = withTiming(1, { duration: 300 });
        return;
      }
      setIsSaving(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setIsSaving(false);
        Alert.alert(
          strings.global.error,
          "Token não encontrado. Faça login novamente."
        );
        return;
      }
      const res = await fetch(`${API_BASE_URL}/cliente/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        const updatedUser = data?.user ?? data ?? null;
        // update AsyncStorage userData if available
        if (updatedUser) {
          try {
            // read existing userData, merge and save
            const raw = await AsyncStorage.getItem("userData");
            const existing = raw ? JSON.parse(raw) : {};
            const merged = {
              ...existing,
              id: updatedUser.id ?? existing.id,
              nome: updatedUser.nome ?? existing.nome,
              email: updatedUser.email ?? existing.email,
              dataNascimento:
                updatedUser.dataNascimento ?? existing.dataNascimento,
            };
            await AsyncStorage.setItem("userData", JSON.stringify(merged));
          } catch (e) {
            // ignore storage errors but log
            console.warn("Erro ao atualizar userData no AsyncStorage", e);
          }
        }

        Alert.alert(
          strings.profile.saveSuccessTitle,
          strings.profile.saveSuccessMessage
        );
        setIsEditing(false);
        ratingOpacity.value = withTiming(1, { duration: 300 });
      } else {
        const message = data?.message ?? strings.global.serverError;
        Alert.alert(strings.global.error, message);
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      Alert.alert(strings.global.error, strings.global.serverError);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility((s) =>
      s === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE
    );
  };

  const animatedRatingStyle = useAnimatedStyle(() => {
    return {
      opacity: ratingOpacity.value,
    };
  });

  return (
    <GestureDetector gesture={flingGesture}>
      <KeyboardShiftView style={styles.container}>
        <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={openDrawer} activeOpacity={0.7}>
            <Menu size={45} color={Colors.primary} />
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>{strings.profile.title}</AppText>
          <Button
            title="Ajuda"
            onPress={() => router.push("/Help")}
            backgroundColor={Colors.background}
            borderColor={Colors.primary}
            textColor={Colors.primary}
            borderWidth={2}
            containerStyle={{
              width: "auto",
              paddingHorizontal: 15,
            }}
          />
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <UserRound size={80} color={Colors.darkGray} />
              <TouchableOpacity
                onPress={() => router.push("/VerificarAvaliacao")}
              >
                <Animated.View
                  style={[styles.ratingContainer, animatedRatingStyle]}
                >
                  <Star size={16} color={Colors.gold} fill={Colors.gold} />
                  <AppText style={styles.ratingText}>4.3</AppText>
                </Animated.View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.8}
              onPress={handleToggleEdit}
            >
              {isEditing ? (
                <X size={20} color={Colors.white} />
              ) : (
                <Pencil size={20} color={Colors.white} />
              )}
            </TouchableOpacity>
          </View>

          {!isEditing && (
            <Animatable.View animation="fadeIn" duration={600}>
              <AppText style={styles.userName}>{nome}</AppText>
              <AppText style={styles.userEmail}>{email}</AppText>
            </Animatable.View>
          )}

          {isEditing && (
            <Animatable.View
              animation="fadeInUp"
              duration={600}
              style={styles.formContainer}
            >
              <Input
                label={strings.cadastroCliente.nomeLabel}
                value={nome}
                onChangeText={setNome}
                containerStyle={styles.inputContainer}
              />
              <Input
                label={strings.cadastroCliente.dataNascLabel}
                value={dataNascimento}
                type="date"
                minAge={18}
                onDateChange={({ date, error }) => {
                  setDataNascimento(date);
                  setErroData(error);
                }}
                containerStyle={styles.inputContainer}
              />
              <Input
                label={strings.global.emailLabel}
                value={email}
                editable={false}
                containerStyle={styles.inputContainer}
              />
              <Input
                label={strings.global.newPasswordLabel}
                placeholder={strings.profile.passwordPlaceholder}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={passwordVisibility === FilterStatus.HIDE}
                status={passwordVisibility}
                onEyeIconPress={togglePasswordVisibility}
                containerStyle={styles.inputContainer}
              />
              <Input
                label={strings.global.confirmPasswordLabel}
                placeholder={strings.global.repeatPasswordPlaceholder}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={passwordVisibility === FilterStatus.HIDE}
                status={passwordVisibility}
                onEyeIconPress={togglePasswordVisibility}
                containerStyle={styles.inputContainer}
              />
              <Button
                title={isSaving ? "Salvando..." : strings.profile.saveButton}
                containerStyle={{ width: "60%", marginTop: 20 }}
                onPress={handleSaveChanges}
                disabled={isSaving}
              />
            </Animatable.View>
          )}
        </ScrollView>
      </KeyboardShiftView>
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

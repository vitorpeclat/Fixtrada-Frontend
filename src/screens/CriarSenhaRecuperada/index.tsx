import { API_BASE_URL } from "@/config/ip";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";

import {
  AnimatedView,
  AnimationProvider,
  AppText,
  Button,
  Input,
  PasswordValidation,
  useScreenAnimation,
} from "@/components";
import { strings } from "@/languages"; // <-- IMPLEMENTAÇÃO
import { Colors } from "@/theme/colors";
import { FilterStatus } from "@/types/FilterStatus";
import { styles } from "./styles";

function CriarSenhaRecuperadaContent() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(
    FilterStatus.HIDE
  );
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
    match: false,
  });
  const formRef =
    useRef<Animatable.View & { shake: (duration: number) => void }>(null);
  const { handleNavigateReplace, handleHardwareBackPress } =
    useScreenAnimation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHardwareBackPress
    );
    return () => backHandler.remove();
  }, [handleHardwareBackPress]);

  useEffect(() => {
    const arePasswordsMatching =
      novaSenha.length > 0 && novaSenha === confirmarSenha;
    setPasswordCriteria((prev) => ({ ...prev, match: arePasswordsMatching }));
  }, [novaSenha, confirmarSenha]);

  const togglePasswordVisibility = () => {
    setPasswordVisibility((s) =>
      s === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE
    );
  };

  const [loading, setLoading] = useState(false);

  async function handleSavePassword() {
    if (!novaSenha.trim() || !confirmarSenha.trim()) {
      Alert.alert(strings.global.attention, strings.global.fillAllFields);
      formRef.current?.shake(800);
      return;
    }
    if (
      !passwordCriteria.length ||
      !passwordCriteria.uppercase ||
      !passwordCriteria.specialChar ||
      !passwordCriteria.match
    ) {
      Alert.alert(
        strings.global.invalidPassword,
        strings.recuperarSenha.newPasswordRequirements
      );
      formRef.current?.shake(800);
      return;
    }
    if (!email) {
      Alert.alert(strings.global.attention, "E-mail ausente.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/password/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, novaSenha: novaSenha.trim() }),
      });
      if (!response.ok) {
        throw new Error("Update failed");
      }
      Alert.alert(
        strings.global.success,
        strings.recuperarSenha.passwordChangedSuccess
      );
      handleNavigateReplace("/Login", "fadeOutUp");
    } catch (e) {
      Alert.alert(strings.global.attention, "Não foi possível atualizar a senha.");
      formRef.current?.shake(800);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
        <AnimatedView style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleNavigateReplace("/Login", "fadeOutDown")}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color={Colors.primary} />
            <AppText style={styles.backButtonText}>{strings.global.backToLogin}</AppText>
          </TouchableOpacity>
        </AnimatedView>

        <AnimatedView>
          <AppText style={styles.title}>{strings.recuperarSenha.createNewPasswordTitle}</AppText>
        </AnimatedView>

        <Animatable.View ref={formRef} style={styles.form}>
          <AnimatedView>
            <Input
              label={strings.recuperarSenha.newPasswordLabel}
              placeholder={strings.global.createStrongPassword}
              type="password"
              onPasswordChange={({ text, criteria }) => {
                setNovaSenha(text);
                setPasswordCriteria((prev) => ({ ...prev, ...criteria }));
              }}
              containerStyle={{ width: "90%" }}
              status={passwordVisibility}
              onEyeIconPress={togglePasswordVisibility}
              secureTextEntry={passwordVisibility === FilterStatus.HIDE}
            />
            <PasswordValidation criteria={passwordCriteria} />
          </AnimatedView>

          <AnimatedView>
            <Input
              label={strings.recuperarSenha.confirmNewPasswordLabel}
              placeholder={strings.recuperarSenha.repeatNewPasswordPlaceholder}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              containerStyle={{ width: "90%" }}
              status={passwordVisibility}
              onEyeIconPress={togglePasswordVisibility}
              secureTextEntry={passwordVisibility === FilterStatus.HIDE}
            />
          </AnimatedView>
          <AnimatedView>
            <Button
              title={loading ? "Salvando..." : strings.recuperarSenha.savePasswordButton}
              onPress={handleSavePassword}
              containerStyle={{ width: "60%" }}
              disabled={loading}
            />
          </AnimatedView>
        </Animatable.View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function CriarSenhaRecuperadaScreen() {
  return (
    <AnimationProvider>
      <CriarSenhaRecuperadaContent />
    </AnimationProvider>
  );
}
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Alert, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";

import {
  AnimatedView,
  AnimationProvider,
  AppText,
  Button,
  Input,
  useScreenAnimation,
} from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles";

function VerificarEmailContent() {
  const [code, setCode] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [userDataRaw, setUserDataRaw] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<Animatable.View & { shake: (d: number) => void }>(
    null
  );
  const { handleGoBack, handleNavigatePush } = useScreenAnimation();

  useEffect(() => {
    AsyncStorage.getItem("userData")
      .then((value) => {
        setUserDataRaw(value);
        if (value) {
          try {
            const parsed = JSON.parse(value);
            setUserData(parsed);
            if (!parsed || (!parsed.email)) {
              console.log("userData (parsed) missing email/usuLogin:", parsed);
            }
          } catch (e) {
            console.log("userData (raw, parse error):", value);
          }
        } else {
          console.log("userData not set:", value);
        }
      })
      .catch((err) => {
        console.log("Erro ao ler userData:", err);
      });
  }, []);

  function handleVerify() {
    const finalEmail = (userData?.email)?.trim();

    if (!finalEmail) {
      console.log(
        "userData when trying to verify email:",
        userData ?? userDataRaw
      );
      Alert.alert(
        strings.global.attention,
        strings.global.emailPlaceholder || "E-mail não encontrado."
      );
      formRef.current?.shake(800);
      return;
    }

    if (!code.trim()) {
      Alert.alert(strings.global.attention, strings.verificarEmail.invalidCode);
      formRef.current?.shake(800);
      return;
    }

    setIsLoading(true);
    fetch(`${API_BASE_URL}/cliente/verificar-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: finalEmail, codigo: code }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          Alert.alert(
            strings.global.success,
            data.message || strings.verificarEmail.successMessage
          );
          handleNavigatePush("/CadastroVeiculo", "fadeOutUp");
        } else if (data && data.message) {
          Alert.alert(strings.global.attention, data.message);
          formRef.current?.shake(800);
        } else {
          Alert.alert(strings.global.error, strings.global.serverError);
        }
      })
      .catch((err) => {
        console.error("Erro na verificação de e-mail:", err);
        Alert.alert(strings.global.error, strings.global.serverError);
      })
      .finally(() => setIsLoading(false));
  }

  function handleResend() {
    Alert.alert(strings.global.success, strings.verificarEmail.resendMessage);
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
            onPress={() => handleGoBack("fadeOutDown")}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color={Colors.primary} />
            <AppText style={styles.backButtonText}>
              {strings.global.backToLogin}
            </AppText>
          </TouchableOpacity>
        </AnimatedView>

        <AnimatedView style={{ marginBottom: 10 }}>
          <AppText style={styles.title}>{strings.verificarEmail.title}</AppText>
          <AppText style={styles.subtitle}>
            {strings.verificarEmail.subtitle}
          </AppText>
        </AnimatedView>

        <Animatable.View ref={formRef} style={styles.form}>
          <AnimatedView>
            <Input
              label={strings.verificarEmail.codeLabel}
              placeholder={strings.verificarEmail.codePlaceholder}
              value={code}
              onChangeText={setCode}
              containerStyle={{ width: "90%" }}
              keyboardType="numeric"
              maxLength={8}
            />
          </AnimatedView>

          <AnimatedView style={{ marginTop: 8 }}>
            <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
              <AppText style={styles.resendText}>
                {strings.verificarEmail.resendLink}
              </AppText>
            </TouchableOpacity>
          </AnimatedView>

          <AnimatedView style={{ marginTop: 18 }}>
            <Button
              title={
                isLoading
                  ? "Verificando..."
                  : strings.verificarEmail.verifyButton
              }
              containerStyle={{ width: "60%" }}
              onPress={handleVerify}
              disabled={isLoading}
            />
          </AnimatedView>
        </Animatable.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function VerificarEmailScreen() {
  return (
    <AnimationProvider>
      <VerificarEmailContent />
    </AnimationProvider>
  );
}
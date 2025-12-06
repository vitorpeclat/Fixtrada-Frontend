import { API_BASE_URL } from "@/config/ip";
import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";

import {
  AnimatedView,
  AnimationProvider,
  AppText,
  Input,
  useScreenAnimation,
} from "@/components";
import { strings } from "@/languages"; // <-- IMPLEMENTAÇÃO
import { Colors } from "@/theme/colors";
import { styles } from "./styles";

function RecuperarCadastroContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef =
    useRef<Animatable.View & { shake: (duration: number) => void }>(null);
  const { handleGoBack, handleNavigatePush, handleHardwareBackPress } =
    useScreenAnimation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHardwareBackPress
    );
    return () => backHandler.remove();
  }, [handleHardwareBackPress]);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handleRecuperar() {
    if (!email.trim()) {
      Alert.alert(strings.global.attention, "Informe o e-mail.");
      formRef.current?.shake(800);
      return;
    }
    if (!emailValido) {
      Alert.alert(strings.global.attention, "E-mail inválido.");
      formRef.current?.shake(800);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/password/request-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      Alert.alert(
        strings.global.success,
        "Se o e-mail estiver cadastrado, enviamos um código de recuperação."
      );
      // Navega para a tela de verificação de código passando o e-mail
      handleNavigatePush(`/VerificarCodigoRecuperacao?email=${encodeURIComponent(email.trim())}`, "fadeOutUp");
    } catch (e) {
      Alert.alert(strings.global.attention, "Não foi possível solicitar recuperação agora.");
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
            onPress={() => handleGoBack("fadeOutDown")}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color={Colors.primary} />
            <AppText style={styles.backButtonText}>{strings.global.backToLogin}</AppText>
          </TouchableOpacity>
        </AnimatedView>

        <AnimatedView>
          <AppText style={styles.title}>{strings.recuperarSenha.recoverAccountTitle}</AppText>
        </AnimatedView>

        <Animatable.View ref={formRef} style={styles.form}>
          <AnimatedView style={{ width: '90%' }}>
            <Input
              label={"E-mail"}
              placeholder={"seuemail@exemplo.com"}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
            />
          </AnimatedView>
          <AnimatedView style={{ width: "60%" }}>
            <TouchableOpacity
              style={[styles.button, (!emailValido || loading) && styles.buttonDisabled]}
              onPress={handleRecuperar}
              disabled={!emailValido || loading}
              activeOpacity={0.7}
            >
              <AppText style={styles.buttonText}>{loading ? "Enviando..." : strings.global.continue}</AppText>
            </TouchableOpacity>
          </AnimatedView>
        </Animatable.View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function RecuperarCadastroScreen() {
  return (
    <AnimationProvider>
      <RecuperarCadastroContent />
    </AnimationProvider>
  );
}
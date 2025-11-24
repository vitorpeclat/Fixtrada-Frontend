import { API_BASE_URL } from "@/config/ip";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

import {
  AnimatedView,
  AnimationProvider,
  AppText,
  KeyboardShiftView,
  useScreenAnimation,
} from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { styles } from "./styles";

function VerificarCodigoRecuperacaoContent() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const formRef =
    useRef<Animatable.View & { shake: (duration: number) => void }>(null);
  const { handleHardwareBackPress, handleNavigateReplace, handleNavigatePush } =
    useScreenAnimation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHardwareBackPress
    );
    return () => backHandler.remove();
  }, [handleHardwareBackPress]);

  // Simple countdown for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const fullCodeEntered = codigo.length === 6;

  const handleChangeCodigo = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 6);
    setCodigo(cleaned);
  };

  async function handleVerifyCodigo() {
    if (!email) {
      Alert.alert(strings.global.attention, "E-mail ausente para verificação.");
      return;
    }
    if (!fullCodeEntered) {
      formRef.current?.shake(800);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/password/confirm-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo: codigo }),
      });
      if (!response.ok) {
        throw new Error("Invalid code");
      }
      Alert.alert(strings.global.success, "Código verificado com sucesso.");
      // Navega para criação de nova senha passando apenas o e-mail
      handleNavigateReplace(`/CriarSenhaRecuperada?email=${encodeURIComponent(String(email))}`, "fadeOutUp");
    } catch (e) {
      Alert.alert(strings.global.attention, "Código inválido ou expirado.");
      formRef.current?.shake(800);
    } finally {
      setLoading(false);
    }
  }

  const handleResend = useCallback(async () => {
    if (!email || resendCooldown > 0) return;
    try {
      setResendCooldown(30); // 30s cooldown
      await fetch(`${API_BASE_URL}/password/request-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      Alert.alert(strings.global.success, "Código reenviado (se e-mail cadastrado)." );
    } catch {
      Alert.alert(strings.global.attention, "Não foi possível reenviar agora.");
    }
  }, [email, resendCooldown]);

  return (
    <KeyboardShiftView style={styles.container}>
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
          <AppText style={styles.title}>Verificar Código</AppText>
        </AnimatedView>
        <AnimatedView>
          <AppText style={styles.subtitle}>
            Enviamos um código de 6 dígitos para {email}. Insira-o abaixo para continuar.
          </AppText>
        </AnimatedView>

        <Animatable.View ref={formRef} style={styles.form}>
          <AnimatedView style={{ width: "100%", alignItems: "center" }}>
            <TextInput
              value={codigo}
              onChangeText={handleChangeCodigo}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              style={{
                letterSpacing: 12,
                fontSize: 26,
                fontWeight: "bold",
                color: Colors.primary,
                borderBottomWidth: 2,
                borderColor: Colors.primary,
                paddingVertical: 12,
                textAlign: "center",
                width: "60%",
              }}
              placeholder="••••••"
              placeholderTextColor={Colors.primaryLight}
            />
          </AnimatedView>
          <AnimatedView style={{ width: "60%" }}>
            <TouchableOpacity
              style={[styles.button, (!fullCodeEntered || loading) && styles.buttonDisabled]}
              onPress={handleVerifyCodigo}
              disabled={!fullCodeEntered || loading}
              activeOpacity={0.7}
            >
              <AppText style={styles.buttonText}>{loading ? "Verificando..." : "Confirmar Código"}</AppText>
            </TouchableOpacity>
          </AnimatedView>
          <AnimatedView>
            <TouchableOpacity
              style={styles.resendButton}
              disabled={resendCooldown > 0}
              onPress={handleResend}
            >
              <Text style={[styles.resendText, resendCooldown > 0 && { opacity: 0.5 }]}>Reenviar código {resendCooldown > 0 ? `(${resendCooldown}s)` : ""}</Text>
            </TouchableOpacity>
          </AnimatedView>
        </Animatable.View>
      </View>
    </KeyboardShiftView>
  );
}

export default function VerificarCodigoRecuperacaoScreen() {
  return (
    <AnimationProvider>
      <VerificarCodigoRecuperacaoContent />
    </AnimationProvider>
  );
}

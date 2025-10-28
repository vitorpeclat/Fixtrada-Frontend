import React, { useRef, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

import {
  AnimatedView,
  AnimationProvider,
  AppText,
  Button,
  Input,
  KeyboardShiftView,
  useScreenAnimation,
} from "@/components";
import { strings } from "@/languages";
import { styles } from "./styles";

function VerificarEmailContent() {
  const [code, setCode] = useState("");
  const formRef = useRef<Animatable.View & { shake: (d: number) => void }>(
    null
  );
  const { handleGoBack, handleNavigatePush } = useScreenAnimation();

  function handleVerify() {
    if (!code.trim()) {
      Alert.alert(strings.global.attention, strings.verificarEmail.invalidCode);
      formRef.current?.shake(800);
      return;
    }

    // Front-end only for now: pretend verification succeeded and navigate.
    Alert.alert(strings.global.success, strings.verificarEmail.successMessage);
    // After verification, continue to vehicle registration (same flow used after signup)
    handleNavigatePush("/CadastroVeiculo", "fadeOutUp");
  }

  function handleResend() {
    // Front-end only placeholder
    Alert.alert(strings.global.success, strings.verificarEmail.resendMessage);
  }

  return (
    <View style={styles.container}>
      <KeyboardShiftView style={styles.content}>
        <AnimatedView style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleGoBack("fadeOutDown")}
            activeOpacity={0.7}
          >
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
              title={strings.verificarEmail.verifyButton}
              containerStyle={{ width: "60%" }}
              onPress={handleVerify}
            />
          </AnimatedView>
        </Animatable.View>
      </KeyboardShiftView>
    </View>
  );
}

export default function VerificarEmailScreen() {
  return (
    <AnimationProvider>
      <VerificarEmailContent />
    </AnimationProvider>
  );
}

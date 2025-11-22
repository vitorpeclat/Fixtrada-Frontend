import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

import {
  AnimatedView,
  AnimationProvider,
  AppText,
  Button,
  Input,
  KeyboardShiftView,
  PasswordValidation,
  useScreenAnimation,
} from "@/components";
import { strings } from "@/languages"; // <-- IMPLEMENTAÇÃO
import { Colors } from "@/theme/colors";
import { FilterStatus } from "@/types/FilterStatus";
import { styles } from "./styles";

function CriarSenhaRecuperadaContent() {
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

  function handleSavePassword() {
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
    Alert.alert(
      strings.global.success,
      strings.recuperarSenha.passwordChangedSuccess
    );
    handleNavigateReplace("/Login", "fadeOutUp");
  }

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
              title={strings.recuperarSenha.savePasswordButton}
              onPress={handleSavePassword}
              containerStyle={{ width: "60%" }}
            />
          </AnimatedView>
        </Animatable.View>
      </View>
    </KeyboardShiftView>
  );
}

export default function CriarSenhaRecuperadaScreen() {
  return (
    <AnimationProvider>
      <CriarSenhaRecuperadaContent />
    </AnimationProvider>
  );
}
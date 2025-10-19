import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useRef, useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

import {
  AnimatedView,
  AnimationProvider,
  AppText,
  Button,
  Input,
  KeyboardShiftView,
  SquareIcon,
  useScreenAnimation,
} from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages"; // <-- IMPLEMENTAÇÃO
import { FilterStatus } from "@/types/FilterStatus";
import { styles } from "./styles";

function LoginContent() {
  const [passwordStatus, setPasswordStatus] = useState(FilterStatus.HIDE);
  const [checkboxStatus, setCheckboxStatus] = useState(FilterStatus.UNCHECKED);
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const formRef = useRef<
    Animatable.View & { shake: (duration: number) => void }
  >(null);
  const { handleNavigatePush } = useScreenAnimation();

  function handleTogglePasswordVisibility() {
    setPasswordStatus((prevState) =>
      prevState === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE
    );
  }

  function handleToggleCheckbox() {
    setCheckboxStatus((currentStatus) =>
      currentStatus === FilterStatus.UNCHECKED
        ? FilterStatus.CHECKED
        : FilterStatus.UNCHECKED
    );
  }

  async function handleLogin() {
    try {
      const response = await fetch(`${API_BASE_URL}/cliente/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha }),
      });
      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          await AsyncStorage.setItem("userToken", data.token);
          await AsyncStorage.setItem("userData", JSON.stringify(data.user));
          handleNavigatePush("/Home", "fadeOutUp");
        }
      } else {
        formRef.current?.shake(800);
        Alert.alert(strings.login.loginFailureTitle, data.message);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      formRef.current?.shake(800);
      Alert.alert(strings.global.error, strings.global.serverError);
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardShiftView style={styles.content}>
        <AnimatedView>
          <Image
            source={require("@/assets/logo-fixtrada.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </AnimatedView>

        <Animatable.View ref={formRef} style={styles.form}>
          <AnimatedView>
            <Input
              label={strings.global.emailLabel}
              placeholder={strings.global.emailPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={{ width: "90%" }}
              value={login}
              onChangeText={setLogin}
            />
          </AnimatedView>
          <AnimatedView>
            <Input
              label={strings.global.passwordLabel}
              placeholder={strings.login.passwordPlaceholder}
              status={passwordStatus}
              onEyeIconPress={handleTogglePasswordVisibility}
              secureTextEntry={passwordStatus === FilterStatus.HIDE}
              containerStyle={{ width: "90%" }}
              value={senha}
              onChangeText={setSenha}
            />
          </AnimatedView>
          <AnimatedView style={styles.row}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={handleToggleCheckbox}
              activeOpacity={0.7}
            >
              <SquareIcon status={checkboxStatus} style={{ marginTop: 2 }} />
              <AppText>{strings.login.rememberMe}</AppText>
            </TouchableOpacity>
            <AppText
              textAlign="right"
              onPress={() =>
                handleNavigatePush("/RecuperarCadastro", "fadeOutUp")
              }
            >
              {strings.login.forgotPassword}
            </AppText>
          </AnimatedView>
          <AnimatedView style={{ marginBottom: 5 }}>
            <Button
              title={strings.login.loginButton}
              containerStyle={{ width: "50%" }}
              onPress={handleLogin}
            />
          </AnimatedView>
          <AnimatedView>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleNavigatePush("/Cadastro", "fadeOutUp")}
            >
              <AppText>
                {strings.login.noAccount}{" "}
                <AppText fontWeight="800" underline>
                  {strings.login.signUp}
                </AppText>
              </AppText>
            </TouchableOpacity>
          </AnimatedView>
        </Animatable.View>
      </KeyboardShiftView>
    </View>
  );
}

export default function LoginScreen() {
  return (
    <AnimationProvider>
      <LoginContent />
    </AnimationProvider>
  );
}

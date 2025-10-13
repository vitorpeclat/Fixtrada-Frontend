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
import { API_BASE_URL } from '@/config/ip';
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
      const response = await fetch(`${API_BASE_URL}/vehicle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha }),
      });
      const data = await response.json();
      if (response.ok) {
        const token = data.token;
        if (token) {
          await AsyncStorage.setItem("userToken", token);
        }
        const response = await fetch(`${API_BASE_URL}/vehicle`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const veiculo = await response.json();
        if (veiculo.found) {
          console.log("Veículo encontrado:", veiculo);
          handleNavigatePush("/Home", "fadeOutUp");
          return;
        } else {
          handleNavigatePush("/CadastroVeiculo", "fadeOutUp");
          return;
        }
      } else {
        formRef.current?.shake(800);
        Alert.alert("Falha no Login", data.message);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      formRef.current?.shake(800);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
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
              label="Email"
              placeholder="exemplo@domínio.com"
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={{ width: "90%" }}
              value={login}
              onChangeText={setLogin}
            />
          </AnimatedView>
          <AnimatedView>
            <Input
              label="Senha"
              placeholder="Digite sua senha"
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
              <AppText>Lembre de mim</AppText>
            </TouchableOpacity>
            <AppText
              textAlign="right"
              onPress={() => handleNavigatePush("/RecuperarSenha", "fadeOutUp")}
            >
              Esqueci minha senha.
            </AppText>
          </AnimatedView>
          <AnimatedView style={{ marginBottom: 5 }}>
            <Button
              title="Logar-se"
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
                Não tem conta?{" "}
                <AppText fontWeight="800" underline>
                  Cadastrar-se
                </AppText>
              </AppText>
            </TouchableOpacity>
          </AnimatedView>
        </Animatable.View>
      </KeyboardShiftView>
    </View>
  );
}

export default function Login() {
  return (
    <AnimationProvider>
      <LoginContent />
    </AnimationProvider>
  );
}

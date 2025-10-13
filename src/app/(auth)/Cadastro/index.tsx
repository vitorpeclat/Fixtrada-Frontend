import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
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
import { API_BASE_URL } from '@/config/ip';
import { Colors } from "@/theme/colors";
import { FilterStatus } from "@/types/FilterStatus";
import { styles } from "./styles";

function CadastroContent() {
  const [usuLogin, setUsuLogin] = useState("");
  const [usuSenha, setUsuSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [usuNome, setUsuNome] = useState("");
  const [usuCpf, setUsuCpf] = useState("");
  const [usuDataNasc, setUsuDataNasc] = useState("");
  const [erroData, setErroData] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(
    FilterStatus.HIDE
  );
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    match: false,
  });
  const formRef = useRef<
    Animatable.View & { shake: (duration: number) => void }
  >(null);
  const { handleGoBack, handleNavigatePush, handleHardwareBackPress } =
    useScreenAnimation();

  const togglePasswordVisibility = () => {
    setPasswordVisibility((s) =>
      s === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE
    );
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHardwareBackPress
    );
    return () => backHandler.remove();
  }, [handleHardwareBackPress]);

  useEffect(() => {
    const arePasswordsMatching =
      usuSenha.length > 0 && usuSenha === confirmarSenha;
    setPasswordCriteria((prev) => ({ ...prev, match: arePasswordsMatching }));
  }, [usuSenha, confirmarSenha]);

  async function handleCadastro() {
    const campos = [
      usuNome,
      usuCpf,
      usuDataNasc,
      usuLogin,
      usuSenha,
      confirmarSenha,
    ];
    if (campos.some((campo) => campo.trim() === "")) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      formRef.current?.shake(800);
      return;
    }
    if (erroData) {
      Alert.alert(
        "Data Inválida",
        "Corrija a data de nascimento para continuar."
      );
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
        "Senha Inválida",
        "Cumpra todos os requisitos de senha para continuar."
      );
      formRef.current?.shake(800);
      return;
    }
    handleNavigatePush("/CadastroVeiculo", "fadeOutUp");

    const [dia, mes, ano] = usuDataNasc.split("/");
    const dataFormatada = `${ano}-${mes}-${dia}`;

    try {
      const response = await fetch(`${API_BASE_URL}/vehicle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuNome,
          usuCpf: usuCpf.replace(/\D/g, ""),
          usuDataNasc: dataFormatada,
          usuLogin,
          usuSenha,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.usuarioID) {
          await AsyncStorage.setItem("usuID", String(data.usuarioID));
        }
        Alert.alert(
          "Cadastro realizado!",
          " Cadastre seu veículo para continuar."
        );
        handleNavigatePush("/Login", "fadeOutUp");
      } else {
        Alert.alert("Falha no Cadastro", data.message);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
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
            <Feather name="chevron-left" size={24} color={Colors.primary} />
            <AppText style={styles.backButtonText}>voltar ao login</AppText>
          </TouchableOpacity>
        </AnimatedView>

        <AnimatedView style={{ marginBottom: 20 }}>
          <AppText style={styles.title}>Cadastro Cliente</AppText>
        </AnimatedView>

        <Animatable.View ref={formRef} style={styles.form}>
          <AnimatedView>
            <Input
              label="Nome"
              placeholder="Digite seu nome completo"
              value={usuNome}
              onChangeText={setUsuNome}
              containerStyle={{ width: "90%" }}
            />
          </AnimatedView>
          <AnimatedView style={styles.row}>
            <Input
              label="CPF"
              placeholder="000.000.000-00"
              value={usuCpf}
              onChangeText={setUsuCpf}
              type="cpf"
              containerStyle={{ width: "48%" }}
              keyboardType="numeric"
              maxLength={14}
            />
            <View style={{ width: "48%" }}>
              <Input
                label="Data Nasc"
                placeholder="DD/MM/AAAA"
                value={usuDataNasc}
                type="age"
                minAge={10}
                onDateChange={({ date, error }) => {
                  setUsuDataNasc(date);
                  setErroData(error);
                }}
              />
              {erroData ? (
                <AppText style={styles.errorText}>{erroData}</AppText>
              ) : null}
            </View>
          </AnimatedView>
          <AnimatedView>
            <Input
              label="Email"
              placeholder="exemplo@dominio.com"
              value={usuLogin}
              onChangeText={setUsuLogin}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={{ width: "90%" }}
            />
          </AnimatedView>
          <AnimatedView>
            <Input
              label="Senha"
              placeholder="Crie uma senha forte"
              status={passwordVisibility}
              onEyeIconPress={togglePasswordVisibility}
              secureTextEntry={passwordVisibility === FilterStatus.HIDE}
              containerStyle={{ width: "90%" }}
              value={usuSenha}
              type="password"
              onPasswordChange={({ text, criteria }) => {
                setUsuSenha(text);
                setPasswordCriteria((prev) => ({ ...prev, ...criteria }));
              }}
            />
            <PasswordValidation criteria={passwordCriteria} />
          </AnimatedView>
          <AnimatedView>
            <Input
              label="Confirmar Senha"
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              status={passwordVisibility}
              onEyeIconPress={togglePasswordVisibility}
              secureTextEntry={passwordVisibility === FilterStatus.HIDE}
              containerStyle={{ width: "90%" }}
              type="password"
            />
          </AnimatedView>
          <AnimatedView style={{ marginTop: 15 }}>
            <Button
              title="Cadastrar"
              containerStyle={{ width: "60%" }}
              onPress={handleCadastro}
            />
          </AnimatedView>
        </Animatable.View>
      </KeyboardShiftView>
    </View>
  );
}

export default function Cadastro() {
  return (
    <AnimationProvider>
      <CadastroContent />
    </AnimationProvider>
  );
}

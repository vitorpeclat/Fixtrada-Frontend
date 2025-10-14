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
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages"; // <-- IMPLEMENTAÇÃO
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
      Alert.alert(strings.global.attention, strings.global.fillAllFields);
      formRef.current?.shake(800);
      return;
    }
    if (erroData) {
      Alert.alert(
        strings.global.invalidDate,
        strings.cadastroCliente.correctBirthDate
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
        strings.global.invalidPassword,
        strings.cadastroCliente.passwordRequirements
      );
      formRef.current?.shake(800);
      return;
    }

    const [dia, mes, ano] = usuDataNasc.split("/");
    const dataFormatada = `${ano}-${mes}-${dia}`;

    try {
      const response = await fetch(`${API_BASE_URL}/users`, { // Sugestão: endpoint /users para cadastro
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
          strings.cadastroCliente.successTitle,
          strings.cadastroCliente.successMessage
        );
        handleNavigatePush("/CadastroVeiculo", "fadeOutUp");
      } else {
        Alert.alert(strings.global.registrationFailed, data.message);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert(strings.global.error, strings.global.serverError);
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
            <AppText style={styles.backButtonText}>{strings.global.backToLogin}</AppText>
          </TouchableOpacity>
        </AnimatedView>

        <AnimatedView style={{ marginBottom: 20 }}>
          <AppText style={styles.title}>{strings.cadastroCliente.title}</AppText>
        </AnimatedView>

        <Animatable.View ref={formRef} style={styles.form}>
          <AnimatedView>
            <Input
              label={strings.cadastroCliente.nomeLabel}
              placeholder={strings.cadastroCliente.nomePlaceholder}
              value={usuNome}
              onChangeText={setUsuNome}
              containerStyle={{ width: "90%" }}
            />
          </AnimatedView>
          <AnimatedView style={styles.row}>
            <Input
              label={strings.global.cpfLabel}
              placeholder={strings.global.cpfPlaceholder}
              value={usuCpf}
              onChangeText={setUsuCpf}
              type="cpf"
              containerStyle={{ width: "48%" }}
              keyboardType="numeric"
              maxLength={14}
            />
            <View style={{ width: "48%" }}>
              <Input
                label={strings.cadastroCliente.dataNascLabel}
                placeholder={strings.global.datePlaceholder}
                value={usuDataNasc}
                type="date"
                minAge={18}
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
              label={strings.global.emailLabel}
              placeholder={strings.global.emailPlaceholder}
              value={usuLogin}
              onChangeText={setUsuLogin}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={{ width: "90%" }}
            />
          </AnimatedView>
          <AnimatedView>
            <Input
              label={strings.global.passwordLabel}
              placeholder={strings.global.createStrongPassword}
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
              label={strings.global.confirmPasswordLabel}
              placeholder={strings.global.repeatPasswordPlaceholder}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              status={passwordVisibility}
              onEyeIconPress={togglePasswordVisibility}
              secureTextEntry={passwordVisibility === FilterStatus.HIDE}
              containerStyle={{ width: "90%" }}
            />
          </AnimatedView>
          <AnimatedView style={{ marginTop: 15 }}>
            <Button
              title={strings.cadastroCliente.button}
              containerStyle={{ width: "60%" }}
              onPress={handleCadastro}
            />
          </AnimatedView>
        </Animatable.View>
      </KeyboardShiftView>
    </View>
  );
}

export default function CadastroScreen() {
  return (
    <AnimationProvider>
      <CadastroContent />
    </AnimationProvider>
  );
}

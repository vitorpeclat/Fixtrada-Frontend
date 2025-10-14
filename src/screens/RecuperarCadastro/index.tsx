import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

import {
    AnimatedView,
    AnimationProvider,
    AppText,
    Input,
    KeyboardShiftView,
    useScreenAnimation,
} from "@/components";
import { strings } from "@/languages"; // <-- IMPLEMENTAÇÃO
import { Colors } from "@/theme/colors";
import { styles } from "./styles";

function RecuperarCadastroContent() {
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [erroData, setErroData] = useState("");
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

  function handleRecuperar() {
    if (!cpf.trim() || !dataNascimento.trim()) {
      Alert.alert(strings.global.attention, strings.global.fillAllFields);
      formRef.current?.shake(800);
      return;
    }
    if (erroData) {
      Alert.alert(
        strings.global.invalidDate,
        strings.recuperarSenha.correctBirthDate
      );
      formRef.current?.shake(800);
      return;
    }

    Alert.alert(
      strings.global.success,
      strings.recuperarSenha.accountFoundMessage
    );
    handleNavigatePush("/CriarSenhaRecuperada", "fadeOutUp");
  }

  return (
    <KeyboardShiftView style={styles.container}>
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
          <AnimatedView style={styles.row}>
            <Input
              label={strings.global.cpfLabel}
              placeholder={strings.global.cpfPlaceholder}
              value={cpf}
              onChangeText={setCpf}
              type="cpf"
              keyboardType="numeric"
              maxLength={14}
              containerStyle={{ width: "48%" }}
            />
            <View style={{ width: "48%" }}>
              <Input
                label={strings.recuperarSenha.dataNascLabel}
                placeholder={strings.global.datePlaceholder}
                value={dataNascimento}
                type="date"
                onDateChange={({ date, error }) => {
                  setDataNascimento(date);
                  setErroData(error);
                }}
              />
              {erroData ? (
                <AppText style={styles.errorText}>{erroData}</AppText>
              ) : null}
            </View>
          </AnimatedView>

          <AnimatedView style={{ width: "60%" }}>
            <TouchableOpacity
              style={[
                styles.button,
                (!cpf.trim() || !dataNascimento.trim()) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleRecuperar}
              disabled={!cpf.trim() || !dataNascimento.trim()}
              activeOpacity={0.7}
            >
              <AppText style={styles.buttonText}>{strings.global.continue}</AppText>
            </TouchableOpacity>
          </AnimatedView>
        </Animatable.View>
      </View>
    </KeyboardShiftView>
  );
}

export default function RecuperarCadastroScreen() {
  return (
    <AnimationProvider>
      <RecuperarCadastroContent />
    </AnimationProvider>
  );
}
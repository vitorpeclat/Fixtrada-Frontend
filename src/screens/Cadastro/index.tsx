import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Animatable from "react-native-animatable";

import {
  AnimatedView,
  AnimationProvider,
  AppText,
  Button,
  Input,
  PasswordValidation,
  useScreenAnimation,
} from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { useAuth } from "@/contexts/AuthContext";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { FilterStatus } from "@/types/FilterStatus";
import { styles } from "./styles";

function CadastroContent() {
  const [usuLogin, setUsuLogin] = useState("");
  const [confirmarEmail, setConfirmarEmail] = useState(""); 
  const [usuSenha, setUsuSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [usuNome, setUsuNome] = useState("");
  const [usuCpf, setUsuCpf] = useState("");
  const [usuDataNasc, setUsuDataNasc] = useState("");
  const [usuTelefone, setUsuTelefone] = useState("");
  const [erroData, setErroData] = useState("");
  const [erroEmail, setErroEmail] = useState(""); 
  const [passwordVisibility, setPasswordVisibility] = useState(
    FilterStatus.HIDE
  );
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [localDisplay, setLocalDisplay] = useState<string>("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
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

  useEffect(() => {
    if (confirmarEmail.length > 0 && usuLogin !== confirmarEmail) {
      setErroEmail(
        strings.cadastroCliente.emailsNaoCoincidem ||
          "Os e-mails não coincidem."
      );
    } else {
      setErroEmail("");
    }
  }, [usuLogin, confirmarEmail]);

  const { signIn } = useAuth();

  const obterLocalizacao = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          strings.global.attention,
          "Permissão de localização negada. Habilite nas configurações."
        );
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });

      setLatitude(pos.coords.latitude);
      setLongitude(pos.coords.longitude);

      if (geocode) {
        const rua = geocode.street || geocode.name || "";
        const numero = geocode.streetNumber || "";
        const bairro = geocode.district || geocode.subregion || "";
        const cidade = geocode.city || geocode.subregion || geocode.name || "";
        const estado = geocode.region || geocode.subregion || "";
        setLocalDisplay(
          `${rua}${numero ? ", " + numero : ""}${bairro ? " - " + bairro : ""}${cidade ? " - " + cidade : ""}${estado ? " - " + estado : ""}`
        );
        Alert.alert(
          "Localização obtida",
          `${rua}${numero ? ", " + numero : ""}\n${bairro ? bairro + " - " : ""}${cidade}${estado ? "/" + estado : ""}`
        );
      } else {
        setLocalDisplay("Coordenadas capturadas");
      }
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      Alert.alert(strings.global.error, "Não foi possível obter sua localização.");
    } finally {
      setLoadingLocation(false);
    }
  };

  async function handleCadastro() {
    const campos = [
      usuNome,
      usuCpf,
      usuDataNasc,
      usuTelefone,
      usuLogin,
      confirmarEmail,
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

    if (erroEmail) {
      Alert.alert(
        strings.global.invalidEmail,
        strings.cadastroCliente.emailsNaoCoincidem 
      );
      formRef.current?.shake(800);
      return;
    }

    if (
      !passwordCriteria.length ||
      !passwordCriteria.uppercase ||
      !passwordCriteria.lowercase ||
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

    if (latitude === null || longitude === null) {
      Alert.alert(
        strings.global.attention,
        "Capture sua localização antes de finalizar o cadastro."
      );
      formRef.current?.shake(800);
      return;
    }

    const [dia, mes, ano] = usuDataNasc.split("/");
    const dataFormatada = `${ano}-${mes}-${dia}`;

    try {
      const response = await fetch(`${API_BASE_URL}/cliente/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuNome,
          usuCpf: usuCpf.replace(/\D/g, ""),
          usuDataNasc: dataFormatada,
          usuTelefone: usuTelefone.replace(/\D/g, ""),
          usuLogin,
          usuSenha,
          latitude,
          longitude,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Garante que o contexto de autenticação seja atualizado imediatamente após o cadastro
        if (data.token && data.user) {
          // O signIn exige que o objeto user tenha a propriedade token
          await signIn({ ...data.user, token: data.token });
        }
        Alert.alert(strings.cadastroCliente.successTitle, data.message);
        handleNavigatePush("/VerificarEmail", "fadeOutUp");
      } else {
        Alert.alert(strings.global.registrationFailed, data.message);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert(strings.global.error, strings.global.serverError);
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
              <AppText style={styles.backButtonText}>
                {strings.global.backToLogin}
              </AppText>
            </TouchableOpacity>
          </AnimatedView>

        <AnimatedView style={{ marginBottom: 20 }}>
          <AppText style={styles.title}>
            {strings.cadastroCliente.title}
          </AppText>
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
              label={strings.global.cellphoneLabel}
              placeholder={strings.global.cellphonePlaceholder}
              value={usuTelefone}
              onChangeText={setUsuTelefone}
              type="cellphone"
              containerStyle={{ width: "90%" }}
              keyboardType="numeric"
            />
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
              label={strings.global.confirmEmailLabel}
              placeholder={ strings.global.confirmEmailPlaceholder 
              }
              value={confirmarEmail}
              onChangeText={setConfirmarEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={{ width: "90%" }}
            />
            {erroEmail ? (
              <AppText style={styles.errorText}>{erroEmail}</AppText>
            ) : null}
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
            <View style={{ marginTop: 12, alignItems: "center", width: "100%" }}>
              <TouchableOpacity
                onPress={obterLocalizacao}
                disabled={loadingLocation}
                style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8 }}
              >
                {loadingLocation ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Feather name="map-pin" size={18} color={Colors.primary} />
                )}
                <AppText style={{ marginLeft: 8, color: Colors.primary }}>
                  {localDisplay
                    ? `Local selecionado: ${localDisplay}`
                    : "Usar minha localização"}
                </AppText>
              </TouchableOpacity>
              {(!latitude || !longitude) && (
                <AppText style={{ marginTop: 4, fontSize: 12, color: Colors.primaryLight }}>
                  Capturar localização é obrigatório para cadastro.
                </AppText>
              )}
            </View>
          </AnimatedView>
        </Animatable.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function CadastroScreen() {
  return (
    <AnimationProvider>
      <CadastroContent />
    </AnimationProvider>
  );
}

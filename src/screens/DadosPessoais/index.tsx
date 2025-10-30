import { AppText, Input } from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Pencil,
  UserRound,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

import { formatPhoneNumber, unformatPhoneNumber } from "../../utils/formatters";

function DadosPessoaisContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [initialData, setInitialData] = useState({ nome: "", email: "", dataNascimento: "", telefone: "" });
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erroData, setErroData] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [currentField, setCurrentField] = useState<
    "nome" | "email" | "dataNascimento" | "idioma" | "telefone" | null
  >(null);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setCurrentField(null);
    setModalTitle("");
    setModalValue("");
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const raw = await AsyncStorage.getItem("userData");
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const [ano, mes, dia] = parsed.dataNascimento.split('-');
        const dataFormatada = `${dia}/${mes}/${ano}`;

        const initial = {
          nome: parsed.nome || "",
          email: parsed.email || "",
          dataNascimento: dataFormatada || "",
          telefone: parsed.telefone || "",
        };
        setInitialData(initial);
        setNome(initial.nome);
        setEmail(initial.email);
        setDataNascimento(initial.dataNascimento);
        setTelefone(formatPhoneNumber(initial.telefone));
      } catch (e) {
        console.error("Erro ao recuperar userData do AsyncStorage:", e);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleHardwareBackPress = () => {
      if (isModalVisible) {
        handleCloseModal();
        return true;
      }
      if (router.canGoBack()) {
        router.back();
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHardwareBackPress
    );

    return () => backHandler.remove();
  }, [isModalVisible, router, handleCloseModal]);

  const handleOpenModal = (
    field: "nome" | "email" | "dataNascimento" | "idioma" | "telefone",
    title: string,
    currentValue: string
  ) => {
    setCurrentField(field);
    setModalTitle(title);
    setModalValue(currentValue);
    setIsModalVisible(true);
  };

  const handleUpdateField = () => {
    switch (currentField) {
      case "nome":
        setNome(modalValue);
        break;
      case "email":
        // O e-mail não deve ser editável
        break;
      case "dataNascimento":
        setDataNascimento(modalValue);
        break;
      case "telefone":
        setTelefone(modalValue);
        break;
    }
    handleCloseModal();
  };

  const handleSaveChanges = async () => {
    const payload: { nome?: string; email?: string; dataNascimento?: string; telefone?: string; } = {};

    if (nome !== initialData.nome) payload.nome = nome;
    if (dataNascimento !== initialData.dataNascimento) {
        const [dia, mes, ano] = dataNascimento.split('/');
        payload.dataNascimento = `${ano}-${mes}-${dia}`;
    }
    if (telefone !== initialData.telefone) payload.telefone = unformatPhoneNumber(telefone);

    if (Object.keys(payload).length === 0) {
      Alert.alert("Nenhuma alteração para salvar.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/cliente/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Seus dados foram atualizados.");
        const newInitialData = { ...initialData, ...payload };
        setInitialData(newInitialData);
        const raw = await AsyncStorage.getItem("userData");
        const parsed = raw ? JSON.parse(raw) : {};
        const updatedUserData = { ...parsed, ...payload };
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
      } else {
        Alert.alert("Erro", responseData.message || "Não foi possível atualizar os dados.");
      }
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      Alert.alert("Erro", "Ocorreu um erro de rede.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.headerIcon, { top: insets.top + 10 }]}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ChevronLeft size={30} color={Colors.primary} />
      </TouchableOpacity>
      <AppText style={[styles.headerTitle, { top: insets.top + 12 }]}>
        {strings.personalDataScreen.title}
      </AppText>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingTop: insets.top + 70 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <UserRound size={80} color={Colors.darkGray} />
          </View>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8} onPress={() => Alert.alert("edição realizada")}>
            <Pencil size={18} color={Colors.background} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => handleOpenModal("nome", strings.personalDataScreen.name, nome)}
        >
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>{strings.personalDataScreen.name}</AppText>
            <AppText style={styles.menuItemValue}>{nome}</AppText>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>
        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <View style={[styles.menuItemContent, { alignItems: "center" }]}>
            <AppText style={styles.menuItemTitle}>{strings.global.emailLabel}</AppText>
            <View style={styles.valueVerified}>
              <AppText style={styles.menuItemValue}>{email}</AppText>
              <CheckCircle2 size={16} color={Colors.primary} style={{ marginLeft: 6 }} />
            </View>
          </View>
        </View>
        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => handleOpenModal("telefone", strings.global.cellphoneLabel, telefone)}
        >
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>{strings.global.cellphoneLabel}</AppText>
            <AppText style={styles.menuItemValue}>{telefone}</AppText>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>
        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => handleOpenModal("dataNascimento", "Data de Nascimento", dataNascimento)}
        >
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>Data de Nascimento</AppText>
            <AppText style={styles.menuItemValue}>{dataNascimento}</AppText>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>
        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => handleOpenModal("idioma", strings.personalDataScreen.language, strings.personalDataScreen.languageSubtitle)}
        >
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>{strings.personalDataScreen.language}</AppText>
            <AppText style={styles.menuItemValue}>{strings.personalDataScreen.languageSubtitle}</AppText>
          </View>
          <ExternalLink size={20} color={Colors.gray} />
        </TouchableOpacity>

        <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
            <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave, { width: '100%' }]}
                onPress={handleSaveChanges}
            >
                <AppText style={styles.modalButtonTextSave}>Salvar Alterações</AppText>
            </TouchableOpacity>
        </View>

      </ScrollView>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <AppText style={styles.modalTitle}>{modalTitle}</AppText>

            <Input
              containerStyle={styles.modalInput}
              value={modalValue}
              onChangeText={setModalValue}
              autoFocus={true}
              keyboardType={currentField === "telefone" ? "phone-pad" : "default"}
              autoCapitalize={currentField === "nome" ? "words" : "none"}
              type={currentField === "dataNascimento" ? "date" : currentField === "telefone" ? "cellphone" : "default"}
              onDateChange={({ date, error }) => {
                if (currentField === "dataNascimento") {
                  setModalValue(date);
                  setErroData(error);
                }
              }}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleCloseModal}
              >
                <AppText style={styles.modalButtonTextCancel}>{strings.global.cancel}</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleUpdateField}
              >
                <AppText style={styles.modalButtonTextSave}>{strings.global.save}</AppText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function DadosPessoaisScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DadosPessoaisContent />
    </GestureHandlerRootView>
  );
}
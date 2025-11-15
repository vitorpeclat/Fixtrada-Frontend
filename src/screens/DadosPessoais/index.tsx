import { AppText, Input } from "@/components";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
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
  const { user, reloadUser } = useAuth();

  const [initialData, setInitialData] = useState({ nome: "", email: "", dataNascimento: "", telefone: "" });
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [currentField, setCurrentField] = useState<
    "nome" | "email" | "idioma" | "telefone" | null
  >(null);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setCurrentField(null);
    setModalTitle("");
    setModalValue("");
  }, []);

  // Load user data from context
  useEffect(() => {
    if (user) {
        const [ano, mes, dia] = (user.dataNascimento || '').split('T')[0].split('-');
        const dataFormatada = dia ? `${dia}/${mes}/${ano}` : "";

        const initial = {
          nome: user.nome || "",
          email: user.email || "",
          dataNascimento: dataFormatada,
          telefone: user.telefone || "",
        };
        setInitialData(initial);
        setNome(initial.nome);
        setEmail(initial.email);
        setDataNascimento(initial.dataNascimento);
        setTelefone(formatPhoneNumber(initial.telefone));
    }
  }, [user]);

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
    field: "nome" | "email" | "idioma" | "telefone",
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
        setEmail(modalValue);
        break;
      case "telefone":
        setTelefone(modalValue);
        break;
    }
    handleCloseModal();
  };

  const handleSaveChanges = async () => {
    const payload: { nome?: string; email?: string; telefone?: string; } = {};

    if (nome !== initialData.nome) payload.nome = nome;
    if (email !== initialData.email) payload.email = email;
    if (unformatPhoneNumber(telefone) !== initialData.telefone) payload.telefone = unformatPhoneNumber(telefone);

    if (Object.keys(payload).length === 0) {
      Alert.alert(strings.personalDataScreen.noChanges);
      return;
    }

    try {
      const response = await api.post("/cliente/update", payload);
      const responseData = response.data;

      if (response.status === 200) {
        Alert.alert(strings.personalDataScreen.success, strings.personalDataScreen.updateSuccess);
        await reloadUser(); // Recarrega os dados do usuário no contexto
      } else {
        Alert.alert(strings.personalDataScreen.error, responseData.message || strings.personalDataScreen.updateError);
      }
    } catch (error: any) {
      console.error("Erro ao salvar os dados:", error);
      Alert.alert(strings.personalDataScreen.error, error.response?.data?.message || strings.personalDataScreen.networkError);
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
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8} onPress={() => Alert.alert(strings.personalDataScreen.editAlert)}>
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

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => handleOpenModal("email", strings.global.emailLabel, email)}
        >
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>{strings.global.emailLabel}</AppText>
            <View style={styles.valueVerified}>
              <AppText style={styles.menuItemValue}>{email}</AppText>
              <CheckCircle2 size={16} color={Colors.primary} style={{ marginLeft: 6 }} />
            </View>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>
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

                <View style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>{strings.personalDataScreen.birthDate}</AppText>
            <AppText style={styles.menuItemValue}>{dataNascimento}</AppText>
          </View>
        </View>
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
                <AppText style={styles.modalButtonTextSave}>{strings.personalDataScreen.saveChanges}</AppText>
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
              keyboardType={currentField === "telefone" ? "phone-pad" : currentField === "email" ? "email-address" : "default"}
              autoCapitalize={currentField === "nome" ? "words" : "none"}
              type={currentField === "telefone" ? "cellphone" : "text"}
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
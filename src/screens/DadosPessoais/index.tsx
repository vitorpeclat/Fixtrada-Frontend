import { AppText, Input } from "@/components";
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

function DadosPessoaisContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [currentField, setCurrentField] = useState<
    "nome" | "telefone" | "email" | "idioma" | null
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
        setNome(parsed.nome || "");
        setEmail(parsed.email || "");
        const storedPhone = parsed.telefone || "+55 11 99823-6319";
        setTelefone(
          storedPhone.startsWith("+55 ")
            ? storedPhone
            : `+55 ${storedPhone.replace(/\D/g, "")}`
        );
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
    field: "nome" | "telefone" | "email" | "idioma",
    title: string,
    currentValue: string
  ) => {
    setCurrentField(field);
    setModalTitle(title);

    if (field === "telefone" && !currentValue.startsWith("+55 ")) {
      setModalValue("+55 ");
    } else {
      setModalValue(currentValue);
    }

    setIsModalVisible(true);
  };

  const handleSave = () => {
    console.log(`Salvando campo "${currentField}": ${modalValue}`);
    switch (currentField) {
      case "nome":
        setNome(modalValue);
        break;
      case "telefone":
        setTelefone(modalValue);
        break;
      case "email":
        setEmail(modalValue);
        break;
      case "idioma":
        break;
    }

    handleCloseModal();
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
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
            <Pencil size={18} color={Colors.background} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() =>
            handleOpenModal("nome", strings.personalDataScreen.name, nome)
          }
        >
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>
              {strings.personalDataScreen.name}
            </AppText>
            <AppText style={styles.menuItemValue}>{nome}</AppText>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>
        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() =>
            handleOpenModal(
              "telefone",
              strings.personalDataScreen.phone,
              telefone
            )
          }
        >
          <View style={[styles.menuItemContent, { alignItems: "center" }]}>
            <AppText style={styles.menuItemTitle}>
              {strings.personalDataScreen.phone}
            </AppText>
            <View style={styles.valueVerified}>
              <AppText style={styles.menuItemValue}>{telefone}</AppText>
              <CheckCircle2
                size={16}
                color={Colors.primary}
                style={{ marginLeft: 6 }}
              />
            </View>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>
        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() =>
            handleOpenModal("email", strings.global.emailLabel, email)
          }
        >
          <View style={[styles.menuItemContent, { alignItems: "center" }]}>
            <AppText style={styles.menuItemTitle}>
              {strings.global.emailLabel}
            </AppText>
            <View style={styles.valueVerified}>
              <AppText style={styles.menuItemValue}>{email}</AppText>
              <CheckCircle2
                size={16}
                color={Colors.primary}
                style={{ marginLeft: 6 }}
              />
            </View>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>
        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() =>
            handleOpenModal(
              "idioma",
              strings.personalDataScreen.language,
              strings.personalDataScreen.languageSubtitle 
            )
          }
        >
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>
              {strings.personalDataScreen.language}
            </AppText>
            <AppText style={styles.menuItemValue}>
              {strings.personalDataScreen.languageSubtitle}
            </AppText>
          </View>
          <ExternalLink size={20} color={Colors.gray} />
        </TouchableOpacity>
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
              keyboardType={
                currentField === "email"
                  ? "email-address"
                  : currentField === "telefone"
                  ? "phone-pad"
                  : "default"
              }
              autoCapitalize={currentField === "nome" ? "words" : "none"}
              type={currentField === "telefone" ? "cellphone" : "text"}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleCloseModal}
              >
                <AppText style={styles.modalButtonTextCancel}>
                  {strings.global.cancel}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSave}
              >
                <AppText style={styles.modalButtonTextSave}>
                  {strings.global.save}
                </AppText>
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
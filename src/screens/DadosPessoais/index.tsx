import { AppText } from "@/components";
import { strings } from "@/languages"; // <-- ADICIONADO
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
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

function DadosPessoaisContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const raw = await AsyncStorage.getItem("userData");
        if (!raw) return;
        const parsed = JSON.parse(raw);
        setNome(parsed.nome || "");
        setEmail(parsed.email || "");
        setTelefone(parsed.telefone || "+5511998236319");
      } catch (e) {
        console.error("Erro ao recuperar userData do AsyncStorage:", e);
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* --- CABEÇALHO --- */}
      <TouchableOpacity
        style={[styles.headerIcon, { top: insets.top + 10 }]}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ChevronLeft size={30} color={Colors.primary} />
      </TouchableOpacity>
      <AppText style={[styles.headerTitle, { top: insets.top + 12 }]}>
        {strings.personalDataScreen.title} {/* <-- ATUALIZADO */}
      </AppText>

      {/* --- CONTEÚDO --- */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingTop: insets.top + 70 }, // Espaço para o cabeçalho
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Avatar --- */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <UserRound size={80} color={Colors.darkGray} />
          </View>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
            <Pencil size={18} color={Colors.background} />
          </TouchableOpacity>
        </View>

        {/* --- Item Nome --- */}
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>
              {strings.personalDataScreen.name}
            </AppText>
            <AppText style={styles.menuItemValue}>{nome}</AppText>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* --- Item Número de telefone --- */}
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>
              {strings.personalDataScreen.phone}
            </AppText>
            <View style={styles.valueVerified}>
              <AppText style={styles.menuItemValue}>{telefone}</AppText>
              <CheckCircle2 size={16} color={Colors.primary} style={{ marginLeft: 6 }} />
            </View>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* --- Item E-mail --- */}
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>
              {strings.global.emailLabel}
            </AppText>
            <View style={styles.valueVerified}>
              <AppText style={styles.menuItemValue}>{email}</AppText>
              <CheckCircle2 size={16} color={Colors.primary} style={{ marginLeft: 6 }} />
            </View>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* --- Item Idioma --- */}
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
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
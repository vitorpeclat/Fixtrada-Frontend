import { AppText } from "@/components";
import { strings } from "@/languages"; // <-- ADICIONADO
import { Colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

function SegurancaContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
        {strings.securityScreen.title} {/* <-- ATUALIZADO */}
      </AppText>

      {/* --- CONTEÚDO --- */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingTop: insets.top + 70 }, // Espaço para o cabeçalho
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Item Senha --- */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => {
            /* Ação para alterar senha */
          }}
        >
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>
              {strings.securityScreen.password} {/* <-- ATUALIZADO */}
            </AppText>
            <AppText style={styles.menuItemSubtitle}>
              {strings.securityScreen.passwordSubtitle} {/* <-- ATUALIZADO */}
            </AppText>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* --- Item Telefone para recuperação --- */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => {
            /* Ação para adicionar telefone */
          }}
        >
          <View style={styles.menuItemContent}>
            <AppText style={styles.menuItemTitle}>
              {strings.securityScreen.recoveryPhone}
            </AppText>
            <AppText style={styles.menuItemSubtitle}>
              {strings.securityScreen.recoveryPhoneSubtitle}
            </AppText>
          </View>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default function SegurancaScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SegurancaContent />
    </GestureHandlerRootView>
  );
}
// ============================================================================
// COMPONENTE: BackButton
// ============================================================================
// Botão para navegação para a tela anterior

import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { styles } from "./styles";

type Props = {
  onPress?: () => void;
  style?: ViewStyle;
};

export function BackButton({ onPress, style }: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons name="chevron-back" size={24} color={Colors.primary} />
    </TouchableOpacity>
  );
}

import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  keyboardVerticalOffset?: number;
}
export function KeyboardShiftView({
  children,
  style,
  keyboardVerticalOffset = 0,
}: Props) {
  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
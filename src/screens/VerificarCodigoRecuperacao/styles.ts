import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "5%",
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.secondary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 16,
    width: "85%",
  },
  form: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    gap: 24,
  },
  codeInputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
  codeBox: {
    width: 46,
    height: 54,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  codeChar: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
  },
  resendButton: {
    marginTop: -12,
  },
  resendText: {
    color: Colors.primary,
    fontSize: 14,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#A0A0A0",
  },
});

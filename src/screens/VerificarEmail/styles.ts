import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 12,
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
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.secondary,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text,
    textAlign: "center",
    width: "90%",
    marginBottom: 8,
  },
  form: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    gap: 14,
  },
  resendText: {
    color: Colors.primary,
    textDecorationLine: "underline",
    fontSize: 14,
  },
});

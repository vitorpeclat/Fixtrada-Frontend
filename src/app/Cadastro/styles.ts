import { Colors } from '@/theme/colors';
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardWrapper: {
    flex: 1,
  },
  scroll: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 24,
  },
  logo: {
    width: 140,
    height: 60,
    marginTop: 8,
    marginBottom: 8,
  },
  backBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  backText: {
    color: "#2C6BE0", // azul link
    fontSize: 13,
  },
  title: {
    width: "100%",
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: "800",
    color: "#F29100", // laranja do mock
    marginBottom: 12,
  },
  form: {
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  inputContainer: {
    width: "90%",
  },
  lastInputContainer: {
    width: "90%",
    marginBottom: 6,
  },
  submitBtn: {
    width: "60%",
    alignSelf: "center",
    marginTop: 8,
  },
});

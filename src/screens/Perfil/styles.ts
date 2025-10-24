// app/(tabs)/Perfil/styles.ts

import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // --- Estrutura e Cabeçalho ---
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 10,
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  headerIcon: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    width: "30%",
    height: 110,
    backgroundColor: Colors.background,
    borderColor: Colors.primary,
    borderWidth: 2,
    padding: 5,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 16,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray,
    width: "90%",
    marginVertical: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.darkGray,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
});
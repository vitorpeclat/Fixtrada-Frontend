// app/Perfil/styles.ts

import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // --- Estrutura e Cabeçalho ---
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    width: "100%",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    flex: 1,
  },
  headerIconPlaceholder: {
    width: 45,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40, // Espaço extra no final
  },

  // --- Avatar e Informações do Usuário ---
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
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.secondary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.darkGray,
    textAlign: "center", // Garante centralização
  },
  userEmail: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 32,
    textAlign: "center", // Garante centralização
  },

  // --- ESTILOS ADICIONADOS PARA O FORMULÁRIO DE EDIÇÃO ---
  formContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16, // Espaçamento entre os inputs
  },
  inputContainer: {
    width: "100%", // Ocupa a largura total do contêiner do formulário
  },
});
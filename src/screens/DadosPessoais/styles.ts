import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // --- Cabeçalho ---
  headerIcon: {
    position: "absolute",
    left: 20,
    zIndex: 10,
    padding: 5,
  },
  headerTitle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
    position: "relative", // Para posicionar o botão de editar
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
    right: "33%",
    backgroundColor: Colors.primary,
    width: 46,
    height: 46,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.background,
  },
  // --- Itens da Lista ---
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },
  menuItemContent: {
    flex: 1,
    marginRight: 10,
  },
  menuItemTitle: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 4,
    // REMOVIDO: textAlign: 'left'
  },
  menuItemValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.darkGray,
    // REMOVIDO: textAlign: 'left'
  },
  valueVerified: {
    flexDirection: "row",
    alignItems: "center",
    // REMOVIDO: justifyContent: 'flex-start'
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray,
    width: "100%",
  },

  // --- Estilos do Modal ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  // ===================================================================
  // MUDANÇA 1: Estilo do Input no Modal
  // As propriedades de estilo (height, border, padding, font, etc.)
  // são agora gerenciadas pelo componente <Input> e seus próprios estilos.
  // Mantemos apenas as propriedades de layout, como a margem.
  // ===================================================================
  modalInput: {
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1, // Faz os botões dividirem o espaço
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonCancel: {
    backgroundColor: Colors.gray,
    marginRight: 8, // Espaço entre os botões
  },
  modalButtonTextCancel: {
    color: Colors.darkGray,
    fontWeight: "bold",
    fontSize: 16,
  },
  modalButtonSave: {
    backgroundColor: Colors.primary,
    marginLeft: 8, // Espaço entre os botões
  },
  modalButtonTextSave: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
});
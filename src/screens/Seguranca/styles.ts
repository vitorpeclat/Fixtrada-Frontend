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
    padding: 5, // Área de toque maior
  },
  headerTitle: {
    position: "absolute",
    top: 0, // 'top' será definido inline
    left: -35,
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
    fontSize: 16,
    fontWeight: "500",
    color: Colors.primary,
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  deleteText: {
    color: "red",
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray,
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1, // Para ocupar espaço igual
  },
  modalButtonCancel: {
    backgroundColor: Colors.lightGray, // Cor de fundo para o botão de cancelar
    marginRight: 10, // Espaço entre os botões
  },
  modalButtonSave: {
    backgroundColor: Colors.primary, // Cor de fundo para o botão de salvar/confirmar
  },
  modalButtonTextCancel: {
    color: Colors.darkGray, // Cor do texto para o botão de cancelar
    fontWeight: "bold",
  },
  modalButtonTextSave: {
    color: Colors.white, // Cor do texto para o botão de salvar/confirmar
    fontWeight: "bold",
  },

  // --- ESTILOS DO BOTTOM SHEET ---
  bottomSheetContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 25,
  },
  bottomSheetInput: {
    width: "100%",
    marginBottom: 15,
  },
  bottomSheetHandle: {
    backgroundColor: Colors.gray, // Cor do "puxador"
  },
  bottomSheetBackground: {
    backgroundColor: Colors.background, // Fundo do modal
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // --- SOMBRA ADICIONADA AQUI ---
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4, // Sombra para cima
    },
    shadowOpacity: 0.1, // Opacidade suave
    shadowRadius: 5,  // Esfumaçado
    // Android Shadow
    elevation: 8,
  },
});
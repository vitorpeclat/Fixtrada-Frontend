import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // --- Cabeçalho ---
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 10,
    backgroundColor: Colors.background,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 4,
  },
  finalizeButton: {
    width: "auto",
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.error, // Vermelho para "Finalizar Serviço"
  },
  finalizeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.white,
  },
  rateButton: {
    width: "auto",
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.gold, // Dourado para "Avaliar Serviço"
  },
  rateButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.white,
  },
  // --- ScrollView Content ---
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  scrollContentContainer: {
    paddingBottom: 30,
  },
  // --- Bloco da Oficina ---
  shopBlock: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "left",
    marginBottom: 2,
  },
  shopSlogan: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: "left",
    marginBottom: 6,
  },
  shopDetail: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: "left",
    marginBottom: 2,
  },
  shopSubtext: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: "left",
    marginTop: 4,
    fontStyle: "italic",
  },
  shopRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  shopRatingText: {
    fontSize: 14,
    color: Colors.darkGray,
    marginRight: 5,
  },
  starIcon: {
    marginHorizontal: 1,
  },
  // --- Separador ---
  separator: {
    height: 6,
    backgroundColor: Colors.primary, // Cor azul escura para o separador
    marginVertical: 0, // Ajusta a margem para ficar justo com os blocos
  },
  // --- Bloco Ordem de Serviço ---
  orderBlock: {
    backgroundColor: Colors.primary, // Fundo azul escuro
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20, // Espaço para o próximo bloco
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
  },
  // --- Detalhes do Veículo e Serviço ---
  detailsBlock: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  vehicleName: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    marginLeft: 10,
    textAlign: "left",
  },
  serviceItem: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: "left",
    marginBottom: 8,
  },
  serviceItemValue: {
    fontWeight: "bold",
    color: Colors.darkGray,
  },
  // --- Descrição ---
  descriptionContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  descriptionLabel: {
    position: "absolute",
    top: -12,
    left: 10,
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    zIndex: 1,
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  descriptionText: {
    fontSize: 15,
    color: Colors.darkGray,
    textAlign: "left",
    lineHeight: 22,
  },
  openChatButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
    borderRadius: 10,
  },
  openChatButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
  },
  openChatButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
  openChatButtonTextDisabled: {
    color: Colors.darkGray,
  },
  // --- Modal de Avaliação ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  starWrapper: {
    position: "relative",
    width: 45,
    height: 45,
  },
  starBase: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  starFillOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "hidden",
    height: 45,
  },
  starTouchLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: "100%",
    zIndex: 10,
  },
  starTouchRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    zIndex: 10,
  },
  starButton: {
    padding: 5,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.darkGray,
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 12,
    fontSize: 14,
    color: Colors.darkGray,
    minHeight: 100,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.darkGray,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
  },
});
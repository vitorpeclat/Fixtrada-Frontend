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
    backgroundColor: Colors.background, // Garante que não seja transparente
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
  newVehicleButton: {
    width: "auto",
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 8,
  },
  newVehicleButtonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.white,
  },
  // --- Conteúdo ---
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 24,
    textAlign: "left",
  },
  // --- Feedback (Loading, Erro, Vazio) ---
  feedbackContainer: {
    flex: 1,
    paddingTop: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: Colors.error,
    textAlign: "center",
    fontSize: 16,
  },
  emptyText: {
    color: Colors.darkGray,
    textAlign: "center",
    fontSize: 16,
  },
  // --- Card do Veículo ---
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // Alinha o botão na base
  },
  cardInfo: {
    flex: 1,
    marginRight: 10, // Espaço entre o texto e o botão
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "baseline", // Alinha o texto na base
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "left",
  },
  cardValue: {
    fontSize: 18,
    color: Colors.darkGray,
    fontWeight: "500",
    textAlign: "left",
    marginLeft: 6,
    flexShrink: 1, // Permite que o texto quebre a linha se for muito longo
  },
  detailsButton: {
    flexShrink: 0, // Impede que o botão encolha
    width: "auto",
    paddingHorizontal: 16,
    height: 44,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.white,
  },
});
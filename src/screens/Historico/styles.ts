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
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 10,
    backgroundColor: Colors.background, // Fundo do cabeçalho
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray, // Linha divisória
  },
  headerIcon: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary, // Cor do texto
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
  // --- Card do Histórico ---
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  // Placeholder para o logo (substitua por Image)
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "left",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: "left",
    marginBottom: 4,
  },
  cardStatus: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "left",
    marginBottom: 12,
  },
  // --- Botões ---
  detailsButton: {
    backgroundColor: Colors.primary,
    height: 44,
    width: "100%",
    borderRadius: 8,
  },
  detailsButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  detailsButtonPending: {
    backgroundColor: Colors.secondary, // Laranja
    height: 44,
    width: "100%",
    borderRadius: 8,
  },
  detailsButtonTextPending: {
    color: Colors.white, // Texto branco no botão laranja
    fontWeight: "bold",
    fontSize: 14,
  },
});
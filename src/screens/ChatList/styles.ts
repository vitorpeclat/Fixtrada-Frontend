import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Cor de fundo principal
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
  // --- Estado Vazio / Loading ---
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: Colors.primary, // Cor do texto
    fontWeight: "500",
  },
  // --- Item da Lista ---
  chatItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    backgroundColor: Colors.white, // Fundo branco para os cards
    marginHorizontal: 16, // Adiciona margem lateral
    borderRadius: 12, // Arredonda os cards
    marginBottom: 12, // Espaçamento entre os cards
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary, // Cor do texto
    textAlign: "left",
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.primary, // Cor do texto
    textAlign: "left",
    opacity: 0.8, // Levemente mais claro
  },
  chatMeta: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.primary, // Cor do texto
    opacity: 0.7, // Mais claro
    marginBottom: 8,
  },
  unreadBadge: {
    backgroundColor: Colors.primary, // Fundo primário
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  unreadText: {
    color: Colors.white, // Texto branco (exceção)
    fontSize: 12,
    fontWeight: "bold",
  },
  // --- ESTILOS DO FAB REMOVIDOS ---
});
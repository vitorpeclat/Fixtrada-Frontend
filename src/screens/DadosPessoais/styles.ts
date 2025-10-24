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
  },
  menuItemValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.darkGray,
  },
  valueVerified: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray,
    width: "100%",
  },
});
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
  divider: {
    height: 1,
    backgroundColor: Colors.gray,
    width: "100%",
  },
});
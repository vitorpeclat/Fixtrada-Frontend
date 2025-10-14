import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // --- Drawer container ---
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // --- Header ---
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    marginBottom: 10,
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.darkGray,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.primary,
  },

  drawerItemsContainer: {
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 17,
    color: Colors.darkGray,
    marginBottom: 1,
    flex: 1,
  },
  menuItemSeparator: {
    height: 1,
    backgroundColor: Colors.lightGray,
    width: '100%',
  },

});
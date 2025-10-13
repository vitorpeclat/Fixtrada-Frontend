import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginTop: 15,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  drawerItemsContainer: {
    paddingTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  drawerItemLabel: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.darkGray,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    padding: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonText: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.darkGray,
  },
});

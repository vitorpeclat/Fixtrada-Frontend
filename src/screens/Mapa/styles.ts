import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerIcon: {
    position: "absolute",
    left: 15,
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  radiusFilterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  radiusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  radiusPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  radiusPillText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  radiusPillTextActive: {
    color: Colors.white,
  },
  sheetList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardAvatarWrap: {
    marginRight: 12,
  },
  cardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardAvatarFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  cardAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

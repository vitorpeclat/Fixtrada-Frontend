import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  headerIcon: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  scrollContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  // --- Novo design moderno do card ---
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.lightGray,
    borderLeftWidth: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codeAndStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardCode: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.secondary,
  },
  cardStatusPill: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  prestadorSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  prestadorName: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text,
  },
  infoGrid: {
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
  },
  infoPair: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.text,
  },
  cardFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    alignItems: "center",
  },
  cardFooterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  // --- Fallback styles (se necessário) ---
  logoPlaceholder: {
    display: "none",
  },
  infoContainer: {
    display: "none",
  },
  cardTitle: {
    display: "none",
  },
  cardRow: {
    display: "none",
  },
  cardMetaSeparator: {
    display: "none",
  },
  cardMeta: {
    display: "none",
  },
  cardDate: {
    display: "none",
  },
  cardStatusBadge: {
    display: "none",
  },
  cardStatus: {
    display: "none",
  },
  detailsButton: {
    display: "none",
  },
  detailsButtonText: {
    display: "none",
  },
  detailsButtonPending: {
    display: "none",
  },
  detailsButtonTextPending: {
    display: "none",
  },
});
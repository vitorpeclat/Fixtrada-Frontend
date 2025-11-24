import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerIcon: {
    position: "absolute",
    left: 20,
    zIndex: 10,
    padding: 5,
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Bold",
    color: Colors.primary,
    zIndex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
    paddingBottom: 8,
  },
  optionalToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  optionalText: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "SemiBold",
  },
  optionalContainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  // Estilos Dashboard
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 15,
    width: "48%",
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontFamily: "Bold",
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  subHeader: {
    fontFamily: "Bold",
    fontSize: 14,
    marginBottom: 10,
    color: Colors.text,
  },
  activityItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityText: {
    fontSize: 14,
    color: Colors.text,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.gray,
  },
  // Estilos Users
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  filterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  filterBadgeActive: {
    backgroundColor: Colors.primary,
  },
  filterBadgeText: {
    fontSize: 12,
    color: Colors.gray,
  },
  filterBadgeTextActive: {
    fontSize: 12,
    color: "#fff",
  },
  resultCard: {
    padding: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  resultName: {
    fontFamily: "Bold",
    fontSize: 16,
  },
  resultType: {
    fontSize: 12,
    color: Colors.gray,
  },
  resultId: {
    fontSize: 10,
    color: Colors.gray,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },
  actionButtonSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: "Medium",
  },
  // Estilos Categories
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  categoryName: {
    fontSize: 14,
    color: Colors.text,
  },
  // Estilos Histórico
  historyHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 5,
  },
  historyHeaderLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontFamily: "Bold",
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  historyId: {
    fontSize: 14,
    fontFamily: "Bold",
    color: Colors.primary,
  },
  historySub: {
    fontSize: 12,
    color: Colors.gray,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.text,
  },
  historyStatus: {
    fontSize: 12,
    fontFamily: "Bold",
  },
  // Relatórios
  reportDescription: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 15,
    lineHeight: 20,
  },
});
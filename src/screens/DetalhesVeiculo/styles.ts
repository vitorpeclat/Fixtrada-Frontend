import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerContainer: {
    position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 10, zIndex: 10,
    backgroundColor: Colors.background,
  },
  backButton: { flexDirection: "row", alignItems: "center" },
  backButtonText: { color: Colors.primary, fontSize: 18, fontWeight: "500", marginLeft: 4 },
  editButton: {
    backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8,
    flexDirection: "row", alignItems: "center", gap: 6,
  },
  editButtonText: { color: Colors.white, fontSize: 14, fontWeight: "600" },
  scroll: { flex: 1, width: "100%" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  headerCard: {
    width: "100%", backgroundColor: Colors.white, borderRadius: 16, padding: 24, alignItems: "center",
    shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6,
    elevation: 3, marginBottom: 20,
  },
  vehicleIcon: { marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.darkGray, marginBottom: 6 },
  subtitle: { fontSize: 16, color: Colors.gray, textAlign: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: Colors.primary, marginBottom: 12, marginTop: 8 },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, paddingVertical: 20, paddingHorizontal: 20,
    shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08,
    shadowRadius: 4, elevation: 2, marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row", alignItems: "flex-start", paddingVertical: 10, borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray + "30",
  },
  infoRowLast: { borderBottomWidth: 0 },
  iconContainer: { width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.primary + "15", alignItems: "center", justifyContent: "center", marginRight: 12 },
  infoContent: { flex: 1, alignItems: "flex-start" },
  cardLabel: { fontSize: 12, color: Colors.gray, marginBottom: 2, textTransform: "uppercase" },
  cardValue: { fontSize: 16, color: Colors.darkGray, fontWeight: "600" },
  feedbackContainer: { flex: 1, paddingTop: 80, alignItems: "center", justifyContent: "center" },
  errorText: { color: Colors.error, textAlign: "center", fontSize: 16 },
  emptyText: { color: Colors.darkGray, textAlign: "center", fontSize: 16 },
});

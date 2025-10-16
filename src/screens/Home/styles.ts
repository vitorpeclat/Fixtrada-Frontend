import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: Colors.background,
    paddingTop: 10,
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
    alignItems: "center",
  },
  contentSection: {
    width: "100%",
    marginBottom: 18,
    alignItems: "center",
  },
  headerIcon: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },
  cardIcon: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.darkGray,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.gray,
    marginBottom: 24,
    lineHeight: 24,
  },
  vehicleContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  vehicleCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  vehicleIconContainer: {
    marginRight: 16,
  },
  vehicleInfoContainer: {
    flex: 1,
  },
  vehicleDataRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  vehicleDataLabel: {
    fontWeight: "bold",
    color: Colors.darkGray,
    marginRight: 8,
  },
  vehicleDataValue: {
    color: Colors.darkGray,
  },
});

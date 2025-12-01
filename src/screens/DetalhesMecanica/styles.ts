import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary + "20",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  loadingText: {
    marginTop: 16,
    color: Colors.text,
    fontSize: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary + "10",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  profileImagePlaceholderText: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.white,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 16,
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: Colors.warning + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 6,
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  chatButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.secondary + "20",
  },
  chatButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
  },
});

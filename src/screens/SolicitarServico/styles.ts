// app/SolicitarServico/styles.ts

import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 18,
    marginLeft: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
  },
  form: {
    width: "100%",
    alignItems: "center",
    gap: 24,
  },
  // Estilos para o Picker e TextArea
  pickerWrapper: {
    width: "100%",
    marginVertical: 8,
  },
  pickerContainer: {
    backgroundColor: Colors.background,
    height: 52,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  label: {
    position: "absolute",
    top: -12,
    left: 16,
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    zIndex: 1,
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerText: {
    fontSize: 16,
    color: Colors.primary,
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  textArea: {
    flex: 1,
    width: '100%',
    fontSize: 16,
    color: Colors.primary,
    textAlignVertical: 'top',
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: "80%",
    maxHeight: "60%",
    paddingVertical: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: "center",
  },
});
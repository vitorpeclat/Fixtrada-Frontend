import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white, // Fundo do chat geralmente é branco
  },
  // --- Cabeçalho ---
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Centraliza o título com 'space-between'
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.background, // Fundo do cabeçalho
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 80, // Largura fixa para ajudar na centralização
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
  },
  // --- Lista de Mensagens ---
  messageList: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  messageListContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  // --- Bolha de Mensagem ---
  messageBubbleContainer: {
    width: "100%",
    marginVertical: 4,
  },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  senderBubble: {
    backgroundColor: Colors.primary, // Azul (Usuário)
    alignSelf: "flex-end",
    borderBottomRightRadius: 4, // Estilo "rabicho"
  },
  receiverBubble: {
    backgroundColor: Colors.gray, // Cinza (Oficina)
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4, // Estilo "rabicho"
  },
  senderText: {
    color: Colors.white,
    fontSize: 16,
  },
  receiverText: {
    color: Colors.darkGray, // Texto escuro no cinza claro
    fontSize: 16,
  },
  // --- Input de Mensagem ---
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: Colors.background, // Fundo da área de input
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120, // Permite crescer até 4 linhas
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 20, // Borda arredondada
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: Colors.white,
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22, // Círculo perfeito
    backgroundColor: Colors.secondary, // Laranja
    justifyContent: "center",
    alignItems: "center",
  },
});
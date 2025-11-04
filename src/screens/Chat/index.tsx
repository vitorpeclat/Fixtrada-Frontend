import { AppText } from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles"; // Estilos no próximo arquivo

// Tipo para uma mensagem
type Message = {
  id: string;
  text: string;
  senderId: "user" | "shop"; // 'user' é o cliente (azul), 'shop' é a oficina (cinza)
};

// Dados de exemplo baseados na sua imagem
const mockMessages: Message[] = [
  {
    id: "4",
    text: "Ok.",
    senderId: "shop",
  },
  {
    id: "3",
    text: "A luz da bateria e do motor acenderam.",
    senderId: "user",
  },
  {
    id: "2",
    text: "Boa tarde, o carro está fazendo um barulho estranho quando liga e não sai do lugar.",
    senderId: "user",
  },
  {
    id: "1",
    text: "Boa tarde, poderia especificar o problema?",
    senderId: "shop",
  },
];

// Componente para a bolha de mensagem
const MessageBubble = ({ message }: { message: Message }) => {
  const isSender = message.senderId === "user";

  return (
    <View
      style={[
        styles.messageBubbleContainer,
        { alignItems: isSender ? "flex-end" : "flex-start" },
      ]}
    >
      <View
        style={[
          styles.bubble,
          isSender ? styles.senderBubble : styles.receiverBubble,
        ]}
      >
        <AppText
          style={isSender ? styles.senderText : styles.receiverText}
          textAlign="left" // Garante alinhamento à esquerda dentro da bolha
        >
          {message.text}
        </AppText>
      </View>
    </View>
  );
};

function ChatContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages); // Estado para as mensagens

  const handleBack = () => {
    router.back();
  };

  const handleSend = () => {
    if (message.trim().length === 0) return;

    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      text: message,
      senderId: "user",
    };

    setMessages([newMessage, ...messages]); 
    setMessage(""); 
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Cabeçalho */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={28} color={Colors.primary} />
          <AppText style={styles.backButtonText}>
            {strings.global.back}
          </AppText>
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Chat</AppText>
        {/* Espaço reservado para alinhar o título ao centro */}
        <View style={{ width: 80 }} />
      </View>

      {/* Lista de Mensagens */}
      <FlatList
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        data={messages}
        renderItem={({ item }) => <MessageBubble message={item} />}
        keyExtractor={(item) => item.id}
        inverted // Essencial para chat!
      />

      {/* Input de Mensagem */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Digite uma mensagem"
          placeholderTextColor={Colors.gray}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Send size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Componente principal para exportar com KeyboardAvoidingView
export default function ChatScreen() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Ajuste conforme necessário
    >
      <ChatContent />
    </KeyboardAvoidingView>
  );
}
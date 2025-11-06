import { AppText } from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";
import { styles } from "./styles"; // Estilos no próximo arquivo

// Tipo para uma mensagem
type Message = {
  id: string;
  text: string;
  senderId: "user" | "shop"; // 'user' é o cliente (azul), 'shop' é a oficina (cinza)
};

interface SocketMessage {
  menID: string; // ID da mensagem (UUID)
  serviceId: string; // ID do serviço/chat
  senderId: string; // ID do usuário que enviou (UUID)
  senderName: string; // Nome de quem enviou
  content: string; // O texto da mensagem
  menData: string; // Data da mensagem (formato ISO string)
}

// Este é o payload que o servidor espera para 'send_message'
interface SendMessagePayload {
  serviceId: string;
  senderId: string; // ID do usuário logado
  senderName: string; // Nome do usuário logado
  content: string; // O texto do input
}

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
  const socketRef = useRef<Socket | null>(null);
  const { serviceId } = useLocalSearchParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]); // Estado para as mensagens
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");
      setToken(token);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    loadUserData();
  }, []);

  const mapSocketMessageToFrontend = (
    msg: SocketMessage,
    currentUserId: string
  ): Message => {
    return {
      id: msg.menID,
      text: msg.content,
      senderId: msg.senderId === currentUserId ? "user" : "shop",
    };
  };

  useEffect(() => {
    // 1. Não fazer nada se o usuário ou token não estiverem prontos
    if (!user || !token) {
      return;
    }

    // 2. Definir o ID do usuário com base no 'user' agora válido
    const currentUserId = user.usuID || "";

    // Conecta ao servidor
    const socket = io(API_BASE_URL, {
      auth: {
        token: token,
      },
    });
    socketRef.current = socket;

    socket.emit("join_service_chat", serviceId);
    console.log(`Entrando no chat do serviço: ${serviceId}`);

    socket.on(
      "chat_history",
      (data: { serviceId: string; history: SocketMessage[] }) => {
        console.log("Histórico recebido:", data.history);
        const mappedHistory = data.history.map((msg) =>
          // 3. Usar o 'currentUserId' correto
          mapSocketMessageToFrontend(msg, currentUserId)
        );
        setMessages(mappedHistory.reverse());
      }
    );

    socket.on("receive_message", (newMessage: SocketMessage) => {
      console.log("Nova mensagem recebida:", newMessage);
      const mappedMessage = mapSocketMessageToFrontend(
        newMessage,
        // 3. Usar o 'currentUserId' correto
        currentUserId
      );
      setMessages((prevMessages) => [mappedMessage, ...prevMessages]);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("auth_error", (msg) => {
      console.error("Socket authentication error:", msg);
      // Opcional: Deslogar o usuário ou mostrar um alerta
    });

    // Função de limpeza
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [serviceId, token, user]); // 4. Adicionar 'user' ao array de dependências

  const handleBack = () => {
    router.back();
  };

  const handleSend = () => {
    if (message.trim().length === 0) return;
    if (!socketRef.current || !user) return; // Garante que o socket está conectado

    const payload: SendMessagePayload = {
      serviceId: serviceId as string,
      senderId: user.usuID,
      senderName: user.nome,
      content: message.trim(),
    };

    // 1. Emitir a mensagem para o servidor
    socketRef.current.emit("send_message", payload);

    // 2. Limpar o input
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
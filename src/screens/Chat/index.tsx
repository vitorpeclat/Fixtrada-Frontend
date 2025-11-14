import { AppText } from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { useAuth } from "@/contexts/AuthContext";
import { Colors } from "@/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";
import { styles } from "./styles"; // Seus estilos corretos

// Define os tipos de mensagem
type Message = {
  id: string;
  senderId: string; // ID de quem enviou
  content: string;
  timestamp: string;
};

// Define o que esperamos da rota (o chatId)
type ChatScreenParams = {
  chatId: string;
};

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth(); // Pega o usuário logado
  
  // 1. Pega o 'chatId' passado pela tela de lista
  const { chatId } = useLocalSearchParams<ChatScreenParams>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [shopName, setShopName] = useState("Chat"); // Nome da oficina
  const socketRef = useRef<Socket | null>(null);

  // 2. Conecta ao Socket.IO e busca mensagens antigas
  useEffect(() => {
    if (!chatId || !user) {
      setLoading(false);
      return;
    }

    // --- Conexão Socket.IO ---
    // Conecta ao seu backend (ajuste a URL se necessário)
    const socket = io(API_BASE_URL, {
      query: {
        userId: user.id, // Envia o ID do usuário para autenticação no socket
      },
    });
    socketRef.current = socket;

    // Entra na "sala" do chat específico
    socket.emit("joinChat", chatId);

    // Ouve por novas mensagens
    socket.on("newMessage", (message: Message) => {
      setMessages((prevMessages) => [message, ...prevMessages]);
    });

    // --- Busca mensagens antigas ---
    const fetchChatDetails = async () => {
      try {
        // (Você precisa criar essa rota no backend)
        // Ex: GET /chats/:chatId/messages
        const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
          headers: {
            Authorization: `Bearer ${user.token}`, // Use o token do useAuth
          },
        });
        const data = await response.json();

        if (response.ok) {
          setMessages(data.messages.reverse()); // Inverte para ordem cronológica
          setShopName(data.shopName); // Pega o nome da oficina
        } else {
          console.error("Falha ao buscar mensagens:", data.message);
        }
      } catch (error) {
        console.error("Erro ao buscar chat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatDetails();

    // Desconecta ao sair da tela
    return () => {
      socket.emit("leaveChat", chatId);
      socket.disconnect();
    };
  }, [chatId, user]);

  // 3. Função para enviar mensagem
  const handleSend = () => {
    if (newMessage.trim() === "" || !socketRef.current || !user) return;

    const messagePayload = {
      chatId: chatId,
      senderId: user.id, // ID do cliente logado
      content: newMessage.trim(),
    };

    // Emite o evento "sendMessage" para o servidor
    socketRef.current.emit("sendMessage", messagePayload);

    // Limpa o input
    setNewMessage("");
  };

  // 4. Renderiza cada bolha de mensagem
  const renderMessageItem = ({ item }: { item: Message }) => {
    const isSender = item.senderId === user.id; // Verifica se é o usuário logado

    return (
      <View style={styles.messageBubbleContainer}>
        <View
          style={[
            styles.bubble,
            isSender ? styles.senderBubble : styles.receiverBubble,
          ]}
        >
          <AppText
            style={isSender ? styles.senderText : styles.receiverText}
          >
            {item.content}
          </AppText>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* --- Cabeçalho --- */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={30} color={Colors.primary} />
          <AppText style={styles.backButtonText}>Voltar</AppText>
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>{shopName}</AppText>
        <View style={{ width: 80 }} /> {/* Espaço para centralizar o título */}
      </View>

      {/* --- Lista de Mensagens --- */}
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          inverted // Começa de baixo para cima
        />
      )}

      {/* --- Input de Mensagem --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom + 80 : 0}
      >
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom || 8 }]}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Digite sua mensagem..."
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Send size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
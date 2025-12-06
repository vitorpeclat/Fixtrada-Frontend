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
import { api } from "../ChatList/api"; // Reutilizando a instância da api

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
    // Envia o JWT no campo `auth.token` para o middleware do servidor
    const socket = io(API_BASE_URL, {
      auth: {
        token: user?.token,
      },
    });
    socketRef.current = socket;

    // Entra na sala do serviço/chat (nome do evento esperado pelo backend)
    socket.emit("join_service_chat", chatId);

    // Ouve por novas mensagens (nome do evento emitido pelo backend)
    socket.on("receive_message", (msg: any) => {
      const mapped: Message = {
        id: msg.menID || msg.id,
        senderId: msg.senderId || msg.fk_remetente_usuID || msg.sender,
        content: msg.content || msg.menConteudo,
        timestamp: msg.menData || msg.timestamp,
      };
      setMessages((prevMessages) => [mapped, ...prevMessages]);
    });

    // --- Busca mensagens antigas ---
    const fetchChatDetails = async () => {
      try {
        // Usando a instância 'api' que já injeta o token de autorização
        const response = await api.get(`/chats/${chatId}/messages`);

        if (response.status === 200) {
          // Backend já retorna no formato correto, não precisa mapear
          const messagesFromApi = response.data.messages || [];
          setMessages(messagesFromApi); // Não inverter, já vem ordenado
          setShopName(response.data.shopName); // Pega o nome da oficina
        } else {
          console.error("Falha ao buscar mensagens:", response.data.message);
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
      socket.emit("leave_service_chat", chatId);
      socket.disconnect();
    };
  }, [chatId, user]);

  // 3. Função para enviar mensagem
  const handleSend = () => {
    if (newMessage.trim() === "" || !socketRef.current || !user) return;

    const messagePayload = {
      serviceId: chatId, // Backend espera 'serviceId' (registroServico.regID). Se não for regID, backend deve mapear.
      senderId: user.id, // ID do cliente logado
      senderName:
        user?.nome || user?.usuNome || user?.mecLogin || user?.name || user?.login,
      content: newMessage.trim(),
    };

    // Emite o evento esperado pelo backend
    socketRef.current.emit("send_message", messagePayload);

    // Limpa o input
    setNewMessage("");
  };

  // 4. Renderiza cada bolha de mensagem
  const renderMessageItem = ({ item }: { item: Message }) => {
    const isSender = item.senderId === user?.id;
    
    return (
      <View style={styles.messageBubbleContainer}>
        <View
          style={[
            styles.bubble,
            isSender ? styles.senderBubble : styles.receiverBubble,
          ]}
        >
          {/* Garante que o conteúdo é sempre renderizado dentro de AppText */}
          <AppText style={isSender ? styles.senderText : styles.receiverText}>
            {typeof item.content === 'string' ? item.content : String(item.content || '')}
          </AppText>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}> 
        {/* --- Cabeçalho --- */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={30} color={Colors.primary} />
            <AppText style={styles.backButtonText}>Voltar</AppText>
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>{shopName}</AppText>
          <View style={{ width: 80 }}>
            {/* Espaço para centralizar o título, sem texto puro */}
          </View>
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
      </View>
    </KeyboardAvoidingView>
  );
}
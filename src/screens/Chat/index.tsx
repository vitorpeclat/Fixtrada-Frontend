import { AppText, BackButton } from "@/components";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { Colors } from "@/theme/colors";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ChatScreenParams = {
  chatId: string;
  serviceId?: string;
};

const formatMessage = (msg: any, currentUser: any): IMessage => ({
  _id: msg.id || msg.menID,
  text: msg.content || msg.menConteudo,
  createdAt: new Date(msg.timestamp || msg.menData),
  user: {
    _id: msg.senderId,
    name: msg.senderName || (msg.senderId === currentUser?.id ? currentUser?.nome : 'Prestador'),
  },
});

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const { chatId, serviceId } = useLocalSearchParams<ChatScreenParams>();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [shopName, setShopName] = useState("Chat");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!chatId) return;
      try {
        setLoading(true);
        const response = await api.get(`/chats/${chatId}/messages`);
        const formattedMessages = response.data.messages.map((msg: any) => formatMessage(msg, user));
        setMessages(formattedMessages);
        setShopName(response.data.shopName);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [chatId, user]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    if (serviceId) {
      socket.emit('join_service_chat', serviceId);
      console.log(`Joined service chat room: ${serviceId}`);
    }

    const handleReceiveMessage = (newMessage: any) => {
      if (newMessage.serviceId === serviceId) {
        const formatted = formatMessage(newMessage, user);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [formatted])
        );
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, isConnected, serviceId, user]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    if (!socket || !isConnected || !serviceId) {
        console.log("Socket not connected or serviceId missing, cannot send message.");
        return;
    }
    const message = newMessages[0];
    const payload = {
      serviceId: serviceId,
      senderId: user.id,
      senderName: user.nome,
      content: message.text,
    };
    socket.emit('send_message', payload);
  }, [socket, isConnected, serviceId, user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <BackButton />
        <AppText style={styles.headerTitle}>{shopName}</AppText>
        <View style={{ width: 50 }} />
      </View>
      <GiftedChat
        messages={messages}
        onSend={(msgs) => onSend(msgs)}
        user={{
          _id: user?.id,
        }}
        placeholder="Digite sua mensagem..."
        renderUsernameOnMessage
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
import { AppText } from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Menu, MessageSquare } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Directions,
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { useAuth } from "@/contexts/AuthContext"; // Substitua pelo caminho real se for diferente
import { api } from "@/screens/ChatList/api"; // Substitua pelo caminho real se for diferente


type ChatSummary = {
  id: string;
  shopName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  logo?: any;
};


function ChatListContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chats, setChats] = useState<ChatSummary[] | null>(null);

  const { user } = useAuth();

  const fetchChats = useCallback(async () => {
    // Garante que o usuário está logado antes de buscar
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.get('/cliente/meus-chats');
      setChats(response.data);
    } catch (error) {
      console.error("Erro ao buscar chats:", error);
      setChats([]); // Define como vazio em caso de erro para mostrar a mensagem correta
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    fetchChats();
  }, [user, fetchChats]);

  const onRefresh = useCallback(async () => {
    if (refreshing || loading) return;
    setRefreshing(true);
    try {
      await fetchChats();
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, loading, fetchChats]);
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(openDrawer)();
    });

  const handleChatPress = (item: ChatSummary) => {
    // Navega para a tela de chat, passando o ID do chat
    router.push(`/Chat?chatId=${item.id}`);
  };

  const renderChatItem = ({ item }: { item: ChatSummary }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
    >
      <View style={styles.logoPlaceholder}>
        <MessageSquare size={24} color={Colors.primary} />
      </View>

      <View style={styles.chatInfo}>
        <AppText style={styles.shopName}>{item.shopName}</AppText>
        <AppText style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </AppText>
      </View>


      <View style={styles.chatMeta}>
        <AppText style={styles.timestamp}>{item.timestamp}</AppText>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <AppText style={styles.unreadText}>{item.unreadCount}</AppText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyOrLoading = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    if (chats?.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyText}>
            {strings.chatsScreen.noActiveChats}
          </AppText>
        </View>
      );
    }
    return null;
  };

  return (
    <GestureDetector gesture={flingGesture}>
      <View style={[styles.container, { paddingTop: insets.top + 70 }]}>
        <View style={[styles.headerContainer, { top: insets.top }]}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={openDrawer}
            activeOpacity={0.7}
          >
            <Menu size={45} color={Colors.primary} />
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>
            {strings.drawerMenu.chat}
          </AppText>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={renderEmptyOrLoading}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]} // Android
              tintColor={Colors.primary} // iOS
            />
          }
        />

      </View>
    </GestureDetector>
  );
}

export default function ChatListScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ChatListContent />
    </GestureHandlerRootView>
  );
}
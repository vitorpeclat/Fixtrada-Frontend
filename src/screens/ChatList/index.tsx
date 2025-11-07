import { AppText } from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Menu, MessageSquare } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
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
  const [chats, setChats] = useState<ChatSummary[] | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setChats([]);
      setLoading(false);
    }, 1500);
  }, []);
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(openDrawer)();
    });

  const handleChatPress = (item: ChatSummary) => {
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
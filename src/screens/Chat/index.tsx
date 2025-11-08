import { AppText } from "@/components";
import { API_BASE_URL } from "@/config/ip";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ChevronLeft, MessageCircle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ChatListItem = {
  id: string;
  shopName: string;
  lastMessage: string;
};

const ChatListItemComponent = ({ item }: { item: ChatListItem }) => {
  return (
    <TouchableOpacity
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() =>
        router.navigate({ pathname: "/Chat", params: { serviceId: item.id } })
      }
    >
      <MessageCircle size={24} color={Colors.primary} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <AppText style={{ fontSize: 16, fontWeight: "bold" }}>
          {item.shopName}
        </AppText>
        <AppText style={{ color: Colors.gray }}>{item.lastMessage}</AppText>
      </View>
    </TouchableOpacity>
  );
};

function ChatListContent() {
  const insets = useSafeAreaInsets();
  const [chats, setChats] = useState<ChatListItem[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/cliente/meus-chats`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setChats(data);
          } else {
            console.error("Failed to fetch chats:", data.message);
          }
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      }
    };

    fetchChats();
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/Home");
    }
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: Colors.white, paddingTop: insets.top }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightGray,
        }}
      >
        <TouchableOpacity onPress={handleBack}>
          <ChevronLeft size={28} color={Colors.primary} />
        </TouchableOpacity>
        <AppText style={{ fontSize: 20, fontWeight: "bold", marginLeft: 16 }}>
          {"Chats"}
        </AppText>
      </View>
      <FlatList
        data={chats}
        renderItem={({ item }) => <ChatListItemComponent item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default function ChatListScreen() {
  return <ChatListContent />;
}
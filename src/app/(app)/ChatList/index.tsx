import { AppText } from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { router, useNavigation } from "expo-router";
import { ChevronLeft, MessageCircle } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerActions } from "@react-navigation/native";

// Mock data for chat list
const mockChats = [
  {
    id: "1",
    shopName: "Oficina do Zé",
    lastMessage: "Boa tarde, poderia especificar o problema?",
  },
  {
    id: "2",
    shopName: "Auto Elétrica do Bairro",
    lastMessage: "Ok.",
  },
];

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
      onPress={() => router.navigate({ pathname: "/Chat", params: { serviceId: item.id } })}
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
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/Home");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white, paddingTop: insets.top }}>
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
        data={mockChats}
        renderItem={({ item }) => <ChatListItemComponent item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default function ChatListScreen() {
  return <ChatListContent />;
}

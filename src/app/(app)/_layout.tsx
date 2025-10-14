import { Colors } from "@/theme/colors";
import { Tabs } from "expo-router";
import { Home, User, Wrench } from "lucide-react-native";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.darkGray,
        tabBarStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="Home/index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="Servicos/index"
        options={{
          title: "Serviços",
          tabBarIcon: ({ color }) => <Wrench color={color} />,
        }}
      />
      <Tabs.Screen
        name="Perfil/index"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <User color={color} />,
        }}
      />
      <Tabs.Screen
        name="Help/index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
import { SocketProvider } from "@/contexts/SocketContext";
import { Colors } from "@/theme/colors";
import { Tabs } from "expo-router";
import { Home, User, Wrench } from "lucide-react-native";

export default function AppLayout() {
  return (
    <SocketProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.secondary,
          tabBarInactiveTintColor: Colors.primary,
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
        <Tabs.Screen
          name="Historico/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="SolicitarServico/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="DadosPessoais/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="VeiculosCliente/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="Seguranca/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="DetalhesServico/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="DetalhesVeiculo/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="UpdateVeiculo/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="ChatList/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="Chat/index"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </SocketProvider>
  );
}

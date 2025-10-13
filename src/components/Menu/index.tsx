import { Colors } from "@/theme/colors";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import { HelpCircle, Home, LogOut, LucideIcon, Settings, User } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles"; // Lembre-se de criar este arquivo fora da pasta /app

interface CustomDrawerItemProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}

function CustomDrawerItem({ icon: Icon, label, onPress }: CustomDrawerItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.drawerItem}>
      <Icon color={Colors.darkGray} size={22} />
      <Text style={styles.drawerItemLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export function MenuContent(props: DrawerContentComponentProps) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: top }}>
        <View style={styles.header}>
          <User size={50} color={Colors.primary} />
          <Text style={styles.headerTitle}>Nome do Usuário</Text>
          <Text style={styles.headerSubtitle}>email@exemplo.com</Text>
        </View>

        <View style={styles.drawerItemsContainer}>
            {/* CORREÇÃO: Usar os caminhos corretos para navegação */}
            <CustomDrawerItem icon={Home} label="Início" onPress={() => router.navigate('/Home')} />
            <CustomDrawerItem icon={User} label="Perfil" onPress={() => router.navigate('/Perfil')} />
            <CustomDrawerItem icon={Settings} label="Configurações" onPress={() => router.navigate('/Configuracoes')} />
            <CustomDrawerItem icon={HelpCircle} label="Ajuda" onPress={() => router.navigate('/Help')} />
        </View>
      </DrawerContentScrollView>
      
      <View style={[styles.footer, { paddingBottom: bottom + 10 }]}>
        <TouchableOpacity onPress={() => console.log('Sair')} style={styles.logoutButton}>
          <LogOut size={22} color={Colors.darkGray} />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
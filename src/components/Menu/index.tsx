import { Colors } from "@/theme/colors";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import { HelpCircle, Home, LogOut, LucideIcon, User, Wrench } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

// Interface para tipar as props do nosso item customizado
interface CustomDrawerItemProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}

// Opção de menu customizada com ícone
function CustomDrawerItem({ icon: Icon, label, onPress }: CustomDrawerItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.drawerItem}>
      <Icon color={Colors.darkGray} size={22} />
      <Text style={styles.drawerItemLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// Componente renomeado para MenuContent
export function MenuContent(props: DrawerContentComponentProps) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: top }}>
        {/* Header do Menu */}
        <View style={styles.header}>
          <User size={50} color={Colors.primary} />
          <Text style={styles.headerTitle}>Nome do Usuário</Text>
          <Text style={styles.headerSubtitle}>email@exemplo.com</Text>
        </View>

        {/* Itens do Menu */}
        <View style={styles.drawerItemsContainer}>
            <CustomDrawerItem icon={Home} label="Início" onPress={() => router.navigate('./Home')} />
            <CustomDrawerItem icon={Wrench} label="Solicitar Serviços" onPress={() => router.navigate('./Servicos')} />
            <CustomDrawerItem icon={User} label="Perfil" onPress={() => router.navigate('./Perfil')} />
            <CustomDrawerItem icon={HelpCircle} label="Ajuda" onPress={() => router.navigate('./Help')} />
        </View>

      </DrawerContentScrollView>
      
      {/* Rodapé com botão de Sair */}
      <View style={[styles.footer, { paddingBottom: bottom + 10 }]}>
        <TouchableOpacity onPress={() => console.log('Sair')} style={styles.logoutButton}>
          <LogOut size={22} color={Colors.darkGray} />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

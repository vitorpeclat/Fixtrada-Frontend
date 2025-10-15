import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import {
  Car,
  ChevronRight,
  HelpCircle,
  History,
  Home,
  LogOut,
  LucideIcon,
  User,
  UserRound,
  Wrench
} from "lucide-react-native";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

interface CustomDrawerItemProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  isFirst?: boolean;
}

function CustomDrawerItem({
  icon: Icon,
  label,
  onPress,
  isFirst = false,
}: CustomDrawerItemProps) {
  return (
    <>
      {!isFirst && <View style={styles.menuItemSeparator} />}
      <TouchableOpacity onPress={onPress} style={styles.menuItem}>
        <Icon color={Colors.primary} size={20} style={{ marginRight: 16 }} />
        <Text style={styles.menuItemText}>{label}</Text>
        <ChevronRight size={24} color={Colors.gray} />
      </TouchableOpacity>
    </>
  );
}

export function MenuContent(props: DrawerContentComponentProps) {
  const { top, bottom } = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      strings.drawerMenu.logoutConfirmTitle,
      strings.drawerMenu.logoutConfirmMessage,
      [
        {
          text: strings.drawerMenu.logoutCancel,
          style: "cancel",
        },
        {
          text: strings.drawerMenu.logout,
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userToken");
              router.replace("/Login");
            } catch (e) {
              console.error("Erro ao tentar sair:", e);
              Alert.alert(
                strings.global.error,
                strings.drawerMenu.logoutError
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <UserRound size={80} color={Colors.darkGray} />
        </View>
        <Text style={styles.headerTitle}>
          {strings.drawerMenu.userNamePlaceholder}
        </Text>
        <Text style={styles.headerSubtitle}>
          {strings.drawerMenu.userEmailPlaceholder}
        </Text>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <View style={styles.drawerItemsContainer}>
          <CustomDrawerItem
            icon={Home}
            label={strings.drawerMenu.home}
            onPress={() => router.navigate("/Home")}
            isFirst
          />
          <CustomDrawerItem
            icon={Wrench}
            label={strings.drawerMenu.services}
            onPress={() => router.navigate("/Servicos")}
          />
          <CustomDrawerItem
            icon={Car}
            label={strings.profile.registeredVehicles}
            onPress={() => {}}
          />
          <CustomDrawerItem
            icon={History}
            label={strings.drawerMenu.history}
            onPress={() => router.navigate("/Historico")}
          />
          <CustomDrawerItem
            icon={User}
            label={strings.drawerMenu.profile}
            onPress={() => router.navigate("/Perfil")}
          />
          <CustomDrawerItem
            icon={HelpCircle}
            label={strings.drawerMenu.help}
            onPress={() => router.navigate("/Help")}
          />
        </View>
      </DrawerContentScrollView>

      <View style={{ paddingBottom: bottom + 10 }}>
        <View style={styles.menuItemSeparator} />
        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
          <LogOut size={20} color={Colors.error} style={{ marginRight: 16 }} />
          <Text style={styles.menuItemText}>{strings.drawerMenu.logout}</Text>
          <ChevronRight size={24} color={Colors.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
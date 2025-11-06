import { useAuth } from "@/contexts/AuthContext";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { router, useFocusEffect } from "expo-router";
import {
  Car,
  ChevronRight,
  HelpCircle,
  History,
  Home,
  LogOut,
  LucideIcon,
  MessageCircle,
  User,
  UserRound,
  Wrench,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
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
  const { signOut, isAuthenticated, user } = useAuth();

  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Load user data when authentication state changes or user data changes
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!isAuthenticated) {
          setUserName(null);
          setUserEmail(null);
          return;
        }

        const userDataStr = await AsyncStorage.getItem("userData");
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          const rawName = userData.nome;
          let displayName: string | null = null;
          if (rawName) {
            const tokens = String(rawName)
              .split(/\s+/)
              .filter((t) => t && t.length > 0);
            if (tokens.length === 0) displayName = String(rawName);
            else if (tokens.length === 1) displayName = tokens[0];
            else displayName = `${tokens[0]} ${tokens[1]}`; // first and second name
          }
          setUserName(displayName);
          setUserEmail(userData.email);
        } else {
          setUserName(null);
          setUserEmail(null);
        }
      } catch (e) {
        console.warn("Erro ao carregar dados do usuário:", e);
        setUserName(null);
        setUserEmail(null);
      }
    };

    loadUser();
  }, [isAuthenticated, user]);

  // Also refresh when drawer is focused
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          if (!isAuthenticated) {
            return;
          }

          const userDataStr = await AsyncStorage.getItem("userData");
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            const rawName = userData.nome;
            let displayName: string | null = null;
            if (rawName) {
              const tokens = String(rawName)
                .split(/\s+/)
                .filter((t) => t && t.length > 0);
              if (tokens.length === 0) displayName = String(rawName);
              else if (tokens.length === 1) displayName = tokens[0];
              else displayName = `${tokens[0]} ${tokens[1]}`; // first and second name
            }
            setUserName(displayName);
            setUserEmail(userData.email);
          }
        } catch (e) {
          console.warn("Erro ao carregar dados do usuário:", e);
        }
      };

      loadUser();
    }, [isAuthenticated])
  );

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
              // Use the AuthContext signOut method to properly clear everything
              await signOut();
              // Clear local state
              setUserName(null);
              setUserEmail(null);
              // Navigate to login screen
              router.replace("/Login");
            } catch (e) {
              console.error("Erro ao tentar sair:", e);
              Alert.alert(strings.global.error, strings.drawerMenu.logoutError);
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
          {userName ?? strings.drawerMenu.userNamePlaceholder}
        </Text>
        <Text style={styles.headerSubtitle}>
          {userEmail ?? strings.drawerMenu.userEmailPlaceholder}
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
            onPress={() => router.navigate("/VeiculosCliente")}
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
          <CustomDrawerItem
            icon={MessageCircle}
            label={"Chats"} // TODO: Adicionar a 'strings.drawerMenu.chats'
            onPress={() => router.navigate("/ChatList")}
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

import { MenuContent } from '@/components/Menu';
import { Colors } from '@/theme/colors';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props: DrawerContentComponentProps) => <MenuContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: Colors.background,
          width: '75%',
        },
        drawerLabelStyle: {
          marginLeft: -20,
        },
        drawerActiveTintColor: Colors.primary,
        drawerInactiveTintColor: Colors.darkGray,
      }}
    >
      <Drawer.Screen name="Home/index" />
      <Drawer.Screen name="Perfil/index" />
      <Drawer.Screen name="Configuracoes/index" />
      <Drawer.Screen name="Ajuda/index" />
    </Drawer>
  );
}
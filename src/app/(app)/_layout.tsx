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
            swipeEnabled: true,
            drawerStyle: {
                backgroundColor: Colors.background,
                width: '75%',
            },
        }}
    />
  );
}
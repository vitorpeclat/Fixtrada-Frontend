import { AnimationProvider } from '@/components';
import { MenuContent } from '@/components/Menu';
import { Colors } from '@/theme/colors';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: Colors.background
                }}>
                <StatusBar style="dark" />
                <AnimationProvider>
                    <AuthProvider>
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
                        >
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                    contentStyle: { backgroundColor: 'transparent' },
                                }}
                            />
                        </Drawer>
                    </AuthProvider>
                </AnimationProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
import { AnimationProvider } from '@/components';
import { Colors } from '@/theme/colors';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AuthProvider } from '@/contexts/AuthContext';
import { VehiclesProvider } from '@/contexts/VehiclesContext';

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
                        <VehiclesProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="(app)" />
                                <Stack.Screen name="(auth)" />
                            </Stack>
                        </VehiclesProvider>
                    </AuthProvider>
                </AnimationProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
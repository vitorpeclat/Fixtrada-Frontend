import { AnimationProvider } from '@/components';
import { Colors } from '@/theme/colors';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: Colors.background
                }}
            >
                <StatusBar style="dark" />

                <AnimationProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: 'transparent' },
                        }}
                    >
                        <Stack.Screen
                            name="Login/index"
                        />
                        <Stack.Screen
                            name="Cadastro/index"
                            options={{
                                presentation: 'modal',
                                animation: 'slide_from_bottom',
                            }}
                        />
                        <Stack.Screen 
                            name="CadastroVeiculo/index"
                            options={{
                                presentation: 'modal',
                                animation: 'slide_from_bottom',
                            }}
                        />
                        <Stack.Screen
                            name="RecuperarSenha/index"
                            options={{
                                presentation: 'modal',
                                animation: 'slide_from_bottom',
                            }}
                        />
                        <Stack.Screen 
                            name="CriarSenhaRecuperada/index"
                            options={{
                                presentation: 'modal',
                                animation: 'slide_from_bottom',
                            }}
                        />
                    </Stack>
                </AnimationProvider>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}
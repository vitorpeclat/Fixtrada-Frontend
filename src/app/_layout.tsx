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

        <Stack 
          screenOptions={{ 
            headerShown: false, 
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen 
            name="Login/index.tsx"
          />
          <Stack.Screen 
            name="Cadastro/index.tsx"
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom', 
            }} 
          />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
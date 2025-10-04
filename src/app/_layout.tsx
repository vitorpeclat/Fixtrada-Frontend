// Em app/_layout.tsx

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="Login/index.tsx" // ✅ CORRETO: Corresponde à pasta/arquivo
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Cadastro/index.tsx"
        options={{ 
          presentation: 'modal',
          headerShown: false,
        }} 
      />
    </Stack>
  );
}
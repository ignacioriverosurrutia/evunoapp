import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
// (1) Importación corregida con el alias '@/'
import { AuthProvider, useAuth } from '@/context/auth-context';

export const unstable_settings = {
  anchor: '(tabs)',
  initialRouteName: '(tabs)', 
};

// Componente raíz principal que envuelve todo
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ProtectedLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}

// Este componente controla la navegación y protección
function ProtectedLayout() {
  // (2) Usamos 'userToken' e 'isLoading' (como están definidos en tu AuthContext)
  const { userToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; // Aún no estamos listos para redirigir
    }

    // (3) Lógica de rutas corregida:
    // Comprobamos si el usuario está en la sección protegida '(tabs)'
    const inProtectedGroup = segments[0] === '(tabs)';

    if (!userToken && inProtectedGroup) {
      // REDIRECCIÓN: No logueado Y en zona protegida -> Enviar a /login
      router.replace('/login');
    } else if (userToken && !inProtectedGroup) {
      // REDIRECCIÓN: Logueado Y fuera de zona protegida (en /login) -> Enviar a /tabs
      // (Añadimos una comprobación extra para no redirigir desde 'modal')
      if (segments[0] !== 'modal') {
        router.replace('/(tabs)');
      }
    }
  }, [userToken, isLoading, segments, router]);

  // Mostrar un splash screen o nada mientras se decide la redirección
  if (isLoading) {
    // Puedes reemplazar 'null' con un <ActivityIndicator /> si lo deseas
    return null; 
  }

  // (4) Renderizar el Stack de navegación completo
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}


// (1) Importaciones que faltaban
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router'; // Importar Stack y hooks de router
import { StatusBar } from 'expo-status-bar'; // Importar StatusBar
import React, { useEffect } from 'react'; // Importar React y useEffect
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
// (2) Importar el AuthProvider y useAuth
import { AuthProvider, useAuth } from '@/context/auth-context';

export const unstable_settings = {
  anchor: '(tabs)',
  initialRouteName: '(tabs)',
};

// Componente raíz principal que envuelve todo en el AuthProvider
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* (3) Usar el componente ProtectedLayout para que no dé la advertencia */}
        <ProtectedLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}

// Este nuevo componente controla la navegación y protección
function ProtectedLayout() {
  const { userToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Esperar a que el contexto termine de cargar el token
    if (isLoading) {
      return; // Aún no estamos listos para redirigir
    }

    // 2. Comprobar si estamos en las rutas protegidas (dentro de '(tabs)')
    const inProtectedGroup = segments[0] === '(tabs)';

    if (!userToken && inProtectedGroup) {
    // 3. REDIRECCIÓN: Si el usuario NO está logueado Y está en la
    // zona protegida, lo mandamos al login.
      router.replace('/login');
    } else if (userToken && !inProtectedGroup) {
    // 4. REDIRECCIÓN: Si el usuario SÍ está logueado Y está
    // fuera de la zona protegida (ej. en la pantalla de login),
    // lo mandamos a la pantalla principal.
      router.replace('/(tabs)');
    }
  }, [userToken, isLoading, segments, router]); // Se re-ejecuta si el token o la ruta cambian

  // Mostrar un splash screen o nada mientras se decide la redirección
  if (isLoading) {
    // Aquí puedes mostrar tu componente de Splash Screen si lo deseas
    return null;
  }

  // Renderizar el Stack de navegación
  // (4) Usamos React.Fragment (<>) para agrupar elementos
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

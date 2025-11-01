// app/_layout.tsx

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router'; // Importar hooks
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react'; // Importar useEffect
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
// Importar el Provider y el hook de autenticación
import { AuthProvider, useAuth } from '@/context/auth-context';

export const unstable_settings = {
  anchor: '(tabs)',
  // Aseguramos que la app intente cargar las pestañas al inicio
  initialRouteName: '(tabs)', 
};

// Componente raíz principal que envuelve todo en el AuthProvider
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
    // Puedes usar <SplashScreen /> de 'expo-splash-screen' aquí
    return null;
  }

  // Renderizar el Stack de navegación
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        {/* (5) Declaramos la pantalla de login en el Stack */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
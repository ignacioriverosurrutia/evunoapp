import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
  // Aseguramos que la app intente cargar las pestañas al inicio
  initialRouteName: '(tabs)', 
};

// Componente raíz principal que envuelve todo en el AuthProvider
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { email } = useAuth();

  if (!email) {
    return <Redirect href="/login" />;
  }

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
      </Tabs>
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
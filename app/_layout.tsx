import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

function RootLayoutNav() {
  const { email } = useAuth();
  
  // Si hay un email registrado, redirige a la pantalla de principal
  if (email) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" redirect={true} />
      </Stack>
    );
  }

  // Si no hay un email registrado, redirige a la pantalla de login
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" redirect={true} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

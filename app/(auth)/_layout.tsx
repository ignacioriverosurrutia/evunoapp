import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

function AuthLayout() {
  const { email, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!email && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (email && inAuthGroup) {
      router.replace('/(tabs)');
    }
    
    if (!initialized) {
      setInitialized(true);
    }
  }, [email, segments, loading, initialized]);
  if (loading || !initialized) {
    return <LoadingScreen />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default AuthLayout;

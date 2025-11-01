import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { email } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Perfil</ThemedText>
      <ThemedText style={styles.subtitle}>Email: {email || 'No disponible'}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  subtitle: {
    marginTop: 12,
  },
});

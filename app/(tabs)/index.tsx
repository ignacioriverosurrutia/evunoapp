import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function Home() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Bienvenido Denuevo!</ThemedText>
      <ThemedText style={styles.subtitle}>Esta es la vista principal de la aplicacion.</ThemedText>
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

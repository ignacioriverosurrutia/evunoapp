import React from 'react';
import { Button, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// (1) Corregir la ruta de importación para usar el alias
import { useAuth } from '@/context/auth-context';

export default function Profile() {
  // (2) Ahora 'email' existe. También obtenemos 'logout'.
  const { email, logout } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Perfil</ThemedText>
      
      <ThemedText style={styles.subtitle}>
        Usuario: {email || 'No disponible'}
      </ThemedText>
      
      {/* (3) Añadir un botón de logout aquí tiene sentido */}
      <ThemedView style={styles.separator} />
      <Button title="Cerrar Sesión" onPress={logout} color="#ff3b30" />
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
    fontSize: 18,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#687076', // Color de ícono
  },
});
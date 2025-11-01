import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('test');
  const [password, setPassword] = useState('test');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth(); // (1) Usamos la función 'login' real del contexto

  // (2) Obtenemos colores del tema para los estilos
  const tintColor = useThemeColor({}, 'tint');
  const inputBg = useThemeColor({ light: '#FFFFFF', dark: '#2C2C2E' }, 'background');
  const inputBorder = useThemeColor({ light: '#C7C7CC', dark: '#545458' }, 'icon');
  const inputText = useThemeColor({}, 'text');
  const placeholderText = useThemeColor({}, 'icon');

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setError(null); // Limpiamos errores anteriores

    // (3) Llamamos a la función 'login' asíncrona del contexto
    const response = await login(email, password);

    // (4) Manejamos la respuesta de validación
    if (!response.success) {
      setError(response.error || 'Error desconocido');
      setIsLoggingIn(false);
    }
    // Si 'response.success' es true, el _layout.tsx nos redirigirá automáticamente.
  };

  // (5) Creamos un estilo dinámico para el TextInput
  const dynamicInputStyle = [
    styles.input,
    {
      backgroundColor: inputBg,
      borderColor: inputBorder,
      color: inputText,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Bienvenido</ThemedText>
      <ThemedText style={styles.subtitle}>{'Usa "test" / "test" para ingresar.'}</ThemedText>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={dynamicInputStyle}
          placeholder="Email (test)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={placeholderText}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={dynamicInputStyle}
          placeholder="Contraseña (test)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={placeholderText}
        />
      </View>

      {/* (6) Mostramos el error de validación */}
      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}

      {isLoggingIn ? (
        <ActivityIndicator size="large" color={tintColor} />
      ) : (
        <Button title="Ingresar" onPress={handleLogin} color={tintColor} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#687076',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#ff3b30', // Un color de error estándar
    textAlign: 'center',
    marginBottom: 10,
  },
});


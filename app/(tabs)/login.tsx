import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, TextInput, View } from 'react-native';
// (1) 'useColorScheme' ya no es necesario aquí, lo borramos.

export default function LoginScreen() {
  const [email, setEmail] = useState('test');
  const [password, setPassword] = useState('test');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  // Obtenemos colores del tema para los estilos
  const tintColor = useThemeColor({}, 'tint');
  const inputBg = useThemeColor({ light: '#FFFFFF', dark: '#2C2C2E' }, 'background');
  const inputBorder = useThemeColor({ light: '#C7C7CC', dark: '#545458' }, 'icon');
  const inputText = useThemeColor({}, 'text');
  const placeholderText = useThemeColor({}, 'icon');

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setError(null);

    const response = await login(email, password);

    if (!response.success) {
      setError(response.error || 'Error desconocido');
      setIsLoggingIn(false);
    }
  };

  // (2) ¡Añadimos 'const' aquí!
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
      {/* (3) Corrección: Envolver la cadena en { } y usar comillas simples */}
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
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 10,
  },
});


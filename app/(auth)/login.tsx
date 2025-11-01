import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '../context/AuthContext';

const BUTTON_TEXT_COLOR = '#ffffff';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setEmail: setAuthEmail } = useAuth();

  const validate = () => {
    setError('');
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido.');
      return false;
    }
    if (!password || password.length === 0) {
      setError('Ingresa la contraseña.');
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validate()) return;
    
    setLoading(true);
    setAuthEmail(email);
    router.replace('/(tabs)');
    setLoading(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Iniciar Sesión</ThemedText>
      
      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : null}
      
      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Correo Electrónico</ThemedText>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="tucorreo@ejemplo.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Contraseña</ThemedText>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={passwordRef}
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
          <Pressable 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons 
              name={showPassword ? 'visibility-off' : 'visibility'} 
              size={24} 
              color="#666" 
            />
          </Pressable>
        </View>
      </View>
      
      <Pressable 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={BUTTON_TEXT_COLOR} />
        ) : (
          <ThemedText style={styles.buttonText}>Iniciar Sesión</ThemedText>
        )}
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: BUTTON_TEXT_COLOR,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
});

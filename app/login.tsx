import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from './context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña');
      return;
    }

    if (password !== '1234') {
      setError('Contraseña incorrecta');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      try {
        signIn(email);
        router.replace('/(tabs)');
      } catch (err) {
        setError('Error al iniciar sesión. Intenta de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <View style={styles.logoContainer}>
        </View>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bienvenido!</Text>
          <Text style={styles.subtitleText}>Inicia sesión para acceder a tu cuenta</Text>
        </View>
      </View>

      <View style={styles.rightSide}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              placeholder="Ingresa tu correo"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              onSubmitEditing={handleLogin}
            />
          </View>
          
          <Pressable
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  leftSide: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  rightSide: {
    flex: 1,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    padding: 40,
    paddingHorizontal: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },
  formContainer: {
    width: '100%',
    maxWidth: 450,
    marginHorizontal: 'auto',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  forgotPassword: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
});

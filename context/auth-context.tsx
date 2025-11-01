import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const TOKEN_KEY = 'my-session-token';
const EMAIL_KEY = 'my-session-email';

// (1) Actualizamos el tipo de la función 'login'
type AuthContextType = {
  userToken: string | null;
  email: string | null;
  isLoading: boolean;
  // (Ahora devuelve un objeto con el estado del éxito)
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedEmail = await AsyncStorage.getItem(EMAIL_KEY);

        if (storedToken && storedEmail) {
          setUserToken(storedToken);
          setEmail(storedEmail);
        }
      } catch (e) {
        console.error('Failed to load auth session', e);
      }
      setIsLoading(false);
    }
    loadSession();
  }, []);

  const login = async (email: string, pass: string) => {
    if (email === 'test' && pass === 'test') {
      try {
        const fakeToken = 'secret-token-12345';
        setUserToken(fakeToken);
        setEmail(email); 
        
        await AsyncStorage.setItem(TOKEN_KEY, fakeToken);
        await AsyncStorage.setItem(EMAIL_KEY, email);
        return { success: true }; // (2) Devolvemos éxito
      } catch (e) {
        console.error('Failed to save auth session', e);
        return { success: false, error: 'Error al guardar sesión.' };
      }
    }
    
    // (3) Quitamos el alert() y devolvemos el error
    return { success: false, error: 'Credenciales incorrectas.' };
  };

  const logout = async () => {
    try {
      setUserToken(null);
      setEmail(null); 
      
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(EMAIL_KEY);
    } catch (e) {
      console.error('Failed to remove auth session', e);
    }
  };

  const value = useMemo(
    () => ({
      userToken,
      email,
      isLoading,
      login,
      logout,
    }),
    [userToken, email, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

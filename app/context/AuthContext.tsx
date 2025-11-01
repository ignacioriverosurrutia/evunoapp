import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  email: string;
  signIn: (email: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState('');

  const signIn = (userEmail: string) => setEmail(userEmail);

  return (
    <AuthContext.Provider value={{ email, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
}

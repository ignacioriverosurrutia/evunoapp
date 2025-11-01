import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthContextType = {
  email: string;
  setEmail: (e: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState('');

  const value = useMemo(() => ({ email, setEmail }), [email]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

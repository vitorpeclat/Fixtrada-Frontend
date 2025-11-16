// ============================================================================
// CONTEXTO: Autenticação
// ============================================================================
// Gerencia estado de autenticação, usuário logado e dados persistidos

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextData {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  signIn(user: any): Promise<void>;
  signOut(): Promise<void>;
  reloadUser(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carrega dados armazenados na inicialização
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storagedUser = await AsyncStorage.getItem('userData');
        const storagedToken = await AsyncStorage.getItem('userToken');

        if (storagedUser && storagedToken) {
          setUser(JSON.parse(storagedUser));
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  // Login: armazena dados do usuário e token
  async function signIn(user: any) {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.setItem('userToken', user.token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro durante login:', error);
      throw error;
    }
  }

  // Logout: limpa todos os dados armazenados
  async function signOut() {
    try {
      await AsyncStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro durante logout:', error);
      throw error;
    }
  }

  // Recarrega dados do usuário do armazenamento
  async function reloadUser() {
    try {
      const storagedUser = await AsyncStorage.getItem('userData');
      const storagedToken = await AsyncStorage.getItem('userToken');
      if (storagedUser && storagedToken) {
        setUser({ ...JSON.parse(storagedUser), token: storagedToken });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao recarregar usuário:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, signIn, signOut, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

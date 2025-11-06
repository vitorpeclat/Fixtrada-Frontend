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
        console.error('Error loading storage data:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  async function signIn(user: any) {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.setItem('userToken', user.token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      // Clear all AsyncStorage data
      await AsyncStorage.clear();
      // Reset user state
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  }

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
      console.error('Error reloading user:', error);
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

  return context;
}

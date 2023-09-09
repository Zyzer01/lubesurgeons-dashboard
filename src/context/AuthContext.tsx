// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { supabase } from '../config/supabaseClient';
import Loader from '../common/Loader';

interface User {
  // Define your user properties here
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
  // Other props if needed
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const adminUserId = ['b9522e4b-2a7a-4e7f-ad5c-068fb7b13165'];

  // Function to check authentication
  const checkAuthentication = async () => {
    try {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }
      const { user } = userData;

      if (user && adminUserId.includes(user.id)) {
        setUser(user);
        setIsAdmin(true);
      } else if (user) {
        setUser(user);
        setIsAdmin(false);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const isLoggedIn = !!user;

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoggedIn, login, logout }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

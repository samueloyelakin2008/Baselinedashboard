import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    if (currentUser) {
      try {
        return await currentUser.getIdToken();
      } catch (error) {
        console.error('Token error:', error);
        return null;
      }
    }
    return null;
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    logout,
    getAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
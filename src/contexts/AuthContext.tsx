import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, type User } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    const initializeAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const currentUser = await apiClient.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
        // Clear invalid token
        apiClient.clearToken();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user: loggedInUser } = await apiClient.login({ email, password });
      setUser(loggedInUser);
      return { error: null };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Login failed' 
        } 
      };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const registerData = {
        name: metadata?.full_name || metadata?.fullName || '',
        email,
        password,
        companyName: metadata?.company_name || metadata?.companyName,
        phone: metadata?.phone,
        businessType: metadata?.business_type || metadata?.businessType || 'manufacturer',
        role: metadata?.user_type || metadata?.userType || 'supplier',
      };

      const { user: newUser } = await apiClient.register(registerData);
      setUser(newUser);
      return { error: null };
    } catch (error) {
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Registration failed' 
        } 
      };
    }
  };

  const signOut = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

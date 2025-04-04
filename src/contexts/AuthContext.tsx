
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

interface Admin {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin data for demonstration purposes
const MOCK_ADMIN: Admin = {
  id: '1',
  name: 'Demo Admin',
  email: 'admin@incumeta.com',
  token: 'demo-token-xyz',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error('Failed to parse stored admin data', error);
        localStorage.removeItem('admin');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // For demo purposes: Accept any email with password "demo123"
      if (password === 'demo123') {
        const adminData = {
          ...MOCK_ADMIN,
          email: email, // Use the provided email
        };

        setAdmin(adminData);
        localStorage.setItem('admin', JSON.stringify(adminData));
        toast.success('Logged in successfully');
      } else {
        throw new Error('Invalid credentials. Use any email with password: demo123');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      
      // For demo purposes, just show success message
      toast.success('Registered successfully, please login with: demo123');
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

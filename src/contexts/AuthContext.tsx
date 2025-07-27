import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  wallet?: string;
  email?: string;
  role: 'student' | 'admin';
  name?: string;
  hasNFT?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (wallet: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  connectWallet: () => Promise<string>;
  mintNFT: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('electnxt-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const connectWallet = async (): Promise<string> => {
    // Simulate wallet connection
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        return accounts[0];
      } catch (error) {
        console.error('Wallet connection failed:', error);
        throw new Error('Failed to connect wallet');
      }
    } else {
      // Simulate wallet for demo
      const demoWallet = '0x' + Math.random().toString(16).substring(2, 42);
      return demoWallet;
    }
  };

  const login = async (wallet: string) => {
    setLoading(true);
    try {
      // Mock eligibility check
      const isEligible = Math.random() > 0.2; // 80% success rate for demo
      
      if (!isEligible) {
        throw new Error('Wallet not in allowlist');
      }

      const newUser: User = {
        id: Math.random().toString(36).substring(7),
        wallet,
        role: 'student',
        name: 'Student User',
        hasNFT: false,
      };

      setUser(newUser);
      localStorage.setItem('electnxt-user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock admin login
      if (email === 'admin@electnxt.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          email,
          role: 'admin',
          name: 'Admin User',
        };
        setUser(adminUser);
        localStorage.setItem('electnxt-user', JSON.stringify(adminUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async () => {
    if (!user) return;
    
    // Simulate NFT minting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updatedUser = { ...user, hasNFT: true };
    setUser(updatedUser);
    localStorage.setItem('electnxt-user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('electnxt-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginWithEmail,
      logout,
      connectWallet,
      mintNFT,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
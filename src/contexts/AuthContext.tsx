import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export type UserRole = 'root' | 'manager' | 'collaborator';
export type Sector = 'fiscal' | 'pessoal' | 'contabil' | 'financeiro';

export interface User {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  sector?: Sector;
  canCreateUsers?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'passwordHash'> & { password: string }) => void;
  updateUser: (id: string, updates: Partial<User> & { password?: string }) => void;
  deleteUser: (id: string) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

// Função simples para hash da senha (em produção, use bcrypt ou similar)
const hashPassword = (password: string): string => {
  return btoa(password + 'salt_key_secret'); // Base64 encoding com salt
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: supabaseUser, isAuthenticated, signIn, signOut } = useSupabaseAuth();
  
  // For now, we'll create a mock user object from the Supabase user
  // In a real implementation, you'd fetch this from your profiles table
  const user: User | null = supabaseUser ? {
    id: supabaseUser.id,
    name: supabaseUser.email?.split('@')[0] || 'User',
    username: supabaseUser.email || '',
    passwordHash: '',
    role: 'manager' // Default role for authenticated users
  } : null;

  // Keep existing users array for backward compatibility
  const users: User[] = [
    { 
      id: '1', 
      name: 'Luciano - Administrador Root', 
      username: 'luciano', 
      passwordHash: hashPassword('37imperial2025'),
      role: 'root' 
    }
  ];

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt with:', username);
      
      // Try Supabase authentication first
      const { error } = await signIn(username, password);
      if (!error) {
        console.log('Supabase login successful');
        return true;
      }
      
      // Fallback to local authentication for backward compatibility
      const foundUser = users.find(u => u.username === username);
      if (foundUser && verifyPassword(password, foundUser.passwordHash)) {
        console.log('Local login successful');
        // For local users, we still need to sign them in to Supabase
        // This is a temporary solution - in production you'd have these users in Supabase
        return true;
      }
      
      console.log('Login failed');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addUser = (newUser: Omit<User, 'id' | 'passwordHash'> & { password: string }) => {
    // This would need to be implemented with Supabase
    console.log('Add user not implemented with Supabase yet');
  };

  const updateUser = (id: string, updates: Partial<User> & { password?: string }) => {
    // This would need to be implemented with Supabase
    console.log('Update user not implemented with Supabase yet');
  };

  const deleteUser = (id: string) => {
    // This would need to be implemented with Supabase
    console.log('Delete user not implemented with Supabase yet');
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // This would need to be implemented with Supabase
    console.log('Change password not implemented with Supabase yet');
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      users,
      addUser,
      updateUser,
      deleteUser,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

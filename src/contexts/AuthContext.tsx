
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
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
  const { user: supabaseUser, isAuthenticated: supabaseAuth, signIn, signOut, signUp } = useSupabaseAuth();
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isLocalAuth, setIsLocalAuth] = useState(false);

  // Users array for local authentication
  const users: User[] = [
    { 
      id: '1', 
      name: 'Luciano - Administrador Root', 
      username: 'luciano', 
      passwordHash: hashPassword('37imperial2025'),
      role: 'root' 
    }
  ];

  // Check for stored local session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('localUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setLocalUser(parsedUser);
        setIsLocalAuth(true);
        console.log('Restored local user session:', parsedUser.name);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('localUser');
      }
    }
  }, []);

  // Determine current user and auth status
  const user: User | null = localUser || (supabaseUser ? {
    id: supabaseUser.id,
    name: supabaseUser.email?.split('@')[0] || 'User',
    username: supabaseUser.email || '',
    passwordHash: '',
    role: 'manager' // Default role for authenticated users
  } : null);

  const isAuthenticated = isLocalAuth || supabaseAuth;

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt with:', username);
      
      // Primeiro tenta login local para compatibilidade
      const foundUser = users.find(u => u.username === username);
      if (foundUser && verifyPassword(password, foundUser.passwordHash)) {
        console.log('Local login successful - usando credenciais locais');
        setLocalUser(foundUser);
        setIsLocalAuth(true);
        // Store in localStorage for persistence
        localStorage.setItem('localUser', JSON.stringify(foundUser));
        return true;
      }
      
      // Se não encontrou localmente, tenta verificar se é um email para Supabase
      const isEmail = username.includes('@');
      if (isEmail) {
        console.log('Attempting Supabase login for email:', username);
        const { error } = await signIn(username, password);
        if (!error) {
          console.log('Supabase login successful');
          // Clear local auth if Supabase login succeeds
          setLocalUser(null);
          setIsLocalAuth(false);
          localStorage.removeItem('localUser');
          return true;
        }
        console.log('Supabase login failed:', error);
      }
      
      console.log('Login failed - credentials not found');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (supabaseAuth) {
        await signOut();
      }
      // Clear local authentication
      setLocalUser(null);
      setIsLocalAuth(false);
      localStorage.removeItem('localUser');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addUser = (newUser: Omit<User, 'id' | 'passwordHash'> & { password: string }) => {
    console.log('Add user functionality - integration with Supabase needed');
  };

  const updateUser = (id: string, updates: Partial<User> & { password?: string }) => {
    console.log('Update user functionality - integration with Supabase needed');
  };

  const deleteUser = (id: string) => {
    console.log('Delete user functionality - integration with Supabase needed');
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    console.log('Change password functionality - integration with Supabase needed');
    return false;
  };

  console.log('Auth state:', { isAuthenticated, isLocalAuth, supabaseAuth, userName: user?.name });

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

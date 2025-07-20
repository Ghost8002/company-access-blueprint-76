
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

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
  addUser: (user: Omit<User, 'id' | 'passwordHash'> & { password: string }) => Promise<void>;
  updateUser: (id: string, updates: Partial<User> & { password?: string }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
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
  const [supabaseUserProfile, setSupabaseUserProfile] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Usuário local para compatibilidade
  const localUsers: User[] = [
    { 
      id: '1', 
      name: 'Luciano - Administrador Root', 
      username: 'luciano', 
      passwordHash: hashPassword('37imperial2025'),
      role: 'root' 
    }
  ];

  // Buscar usuários do Supabase
  const fetchSupabaseUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      if (profiles) {
        const supabaseUsers: User[] = profiles.map(profile => ({
          id: profile.id,
          name: profile.name,
          username: profile.email,
          passwordHash: '',
          role: profile.role as UserRole,
          sector: profile.sector as Sector || undefined
        }));

        // Combinar usuários locais com usuários do Supabase
        setUsers([...localUsers, ...supabaseUsers]);
        console.log('Users loaded:', [...localUsers, ...supabaseUsers].length);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Se não conseguir buscar do Supabase, usar apenas usuários locais
      setUsers(localUsers);
    }
  };

  // Fetch user profile from Supabase when user is authenticated
  useEffect(() => {
    const fetchSupabaseUserProfile = async () => {
      if (supabaseUser && supabaseAuth) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
            return;
          }

          if (profile) {
            setSupabaseUserProfile({
              id: profile.id,
              name: profile.name,
              username: profile.email,
              passwordHash: '',
              role: profile.role as UserRole,
              sector: profile.sector as Sector || undefined
            });
            console.log('Supabase user profile loaded:', profile.name, 'Role:', profile.role);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setSupabaseUserProfile(null);
      }
    };

    if (supabaseUser && supabaseAuth) {
      fetchSupabaseUserProfile();
    }
  }, [supabaseUser, supabaseAuth]);

  // Buscar todos os usuários quando o contexto é inicializado
  useEffect(() => {
    fetchSupabaseUsers();
  }, []);

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
  const user: User | null = localUser || supabaseUserProfile;
  const isAuthenticated = isLocalAuth || supabaseAuth;

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt with:', username);
      
      // Primeiro tenta login local para compatibilidade
      const foundUser = localUsers.find(u => u.username === username);
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
          // Recarregar usuários após login
          await fetchSupabaseUsers();
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
      setSupabaseUserProfile(null);
      localStorage.removeItem('localUser');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addUser = async (newUser: Omit<User, 'id' | 'passwordHash'> & { password: string }) => {
    try {
      console.log('Adding new user via Supabase:', newUser.username);
      
      // Criar usuário no Supabase Auth
      const { data, error } = await signUp(newUser.username, newUser.password);
      
      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      if (data.user) {
        // Atualizar perfil do usuário
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: newUser.name,
            role: newUser.role,
            sector: newUser.sector
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }

        // Recarregar lista de usuários
        await fetchSupabaseUsers();
        console.log('User added successfully');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const updateUser = async (id: string, updates: Partial<User> & { password?: string }) => {
    try {
      console.log('Updating user:', id, updates);
      
      // Atualizar perfil no Supabase
      const profileUpdates: any = {};
      if (updates.name) profileUpdates.name = updates.name;
      if (updates.role) profileUpdates.role = updates.role;
      if (updates.sector) profileUpdates.sector = updates.sector;

      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      // Recarregar lista de usuários
      await fetchSupabaseUsers();
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      console.log('Deleting user:', id);
      
      // Deletar perfil do Supabase (isso deve cascatear para auth.users)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }

      // Recarregar lista de usuários
      await fetchSupabaseUsers();
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      console.log('Attempting to change password');
      
      if (!supabaseAuth || !supabaseUser) {
        console.log('Not authenticated with Supabase');
        return false;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error changing password:', error);
        return false;
      }

      console.log('Password changed successfully');
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  };

  console.log('Auth state:', { 
    isAuthenticated, 
    isLocalAuth, 
    supabaseAuth, 
    userName: user?.name,
    userRole: user?.role,
    totalUsers: users.length
  });

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


import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserFormProps {
  user?: any;
  onClose: () => void;
}

export const UserForm = ({ user, onClose }: UserFormProps) => {
  const { addUser, updateUser, user: currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    password: '',
    role: user?.role || 'collaborator',
    sector: user?.sector || '',
    canCreateUsers: user?.canCreateUsers || false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user && !formData.password) {
      toast({
        title: "Erro",
        description: "Senha é obrigatória para novos usuários",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      if (user) {
        // Se não digitou nova senha, não incluir no update
        const updateData = formData.password 
          ? formData 
          : { 
              name: formData.name, 
              username: formData.username, 
              role: formData.role, 
              sector: formData.sector,
              canCreateUsers: formData.canCreateUsers
            };
        await updateUser(user.id, updateData);
        toast({
          title: "Usuário atualizado",
          description: "O usuário foi atualizado com sucesso.",
        });
      } else {
        await addUser(formData);
        toast({
          title: "Usuário criado",
          description: "O usuário foi criado com sucesso.",
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar usuário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const requiresSector = formData.role === 'manager' || formData.role === 'collaborator';
  
  // Verificar se o usuário atual pode gerenciar permissões de usuários
  const canManageUserCreation = () => {
    return currentUser?.role === 'root' || currentUser?.username === 'salesdesouzamatheus@gmail.com';
  };

  // Verificar se o usuário atual pode alterar níveis
  const canChangeUserLevels = () => {
    return currentUser?.role === 'root' || currentUser?.username === 'salesdesouzamatheus@gmail.com';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={onClose} 
          disabled={loading}
          className="flex items-center space-x-2 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
        </h2>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="username"
                  type="email"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={loading}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  {user ? 'Nova Senha (deixe em branco para manter atual)' : 'Senha'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!user}
                  disabled={loading}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Função</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    role: value, 
                    sector: value === 'root' ? '' : formData.sector,
                    canCreateUsers: value === 'root' ? false : formData.canCreateUsers
                  })}
                  disabled={!canChangeUserLevels() || loading}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectItem value="collaborator" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Colaborador</SelectItem>
                    <SelectItem value="manager" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Gerente</SelectItem>
                    {canManageUserCreation() && (
                      <SelectItem value="root" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Administrador Root</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {!canChangeUserLevels() && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Você não tem permissão para alterar o nível do usuário
                  </p>
                )}
              </div>

              {requiresSector && (
                <div className="space-y-2">
                  <Label htmlFor="sector" className="text-gray-700 dark:text-gray-300">Setor</Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) => setFormData({ ...formData, sector: value })}
                    required={requiresSector}
                    disabled={loading}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectItem value="fiscal" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Fiscal</SelectItem>
                      <SelectItem value="pessoal" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Pessoal</SelectItem>
                      <SelectItem value="contabil" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Contábil</SelectItem>
                      <SelectItem value="financeiro" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.role === 'manager' && canManageUserCreation() && (
                <div className="space-y-3 col-span-2">
                  <Label className="text-gray-700 dark:text-gray-300">Permissões do Gerente</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canCreateUsers"
                      checked={formData.canCreateUsers}
                      onCheckedChange={(checked) => setFormData({ ...formData, canCreateUsers: checked as boolean })}
                      disabled={loading}
                      className="border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor="canCreateUsers" className="text-sm text-gray-700 dark:text-gray-300">
                      Pode criar e gerenciar usuários
                    </Label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 border-0"
              >
                {loading ? 'Salvando...' : (user ? 'Atualizar Usuário' : 'Criar Usuário')}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={loading}
                className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useState } from 'react';
import { MacOSCardAnimated } from '@/components/ui/macos-card-animated';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveButton } from '@/components/ui/interactive-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { useConfig } from '../../contexts/ConfigContext';
import { Building2, ArrowLeft } from 'lucide-react';
import { MacOSFade, MacOSSpring } from '@/components/ui/macos-animations';

interface SignUpFormProps {
  onBackToLogin: () => void;
}

export const SignUpForm = ({ onBackToLogin }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useSupabaseAuth();
  const { config } = useConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Conta criada com sucesso! Verifique seu email para confirmar.');
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MacOSFade>
      <div className="min-h-screen flex items-center justify-center p-4">
        <MacOSCardAnimated 
          interactive 
          glassEffect 
          className="w-full max-w-md shadow-xl"
        >
          <CardHeader className="text-center space-y-4">
            <MacOSSpring scale lift className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
              {config.logo ? (
                <img 
                  src={config.logo} 
                  alt={config.name} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-8 h-8 text-white" />
              )}
            </MacOSSpring>
            <CardTitle className="text-2xl font-bold">
              Criar Conta - {config.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  minLength={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                  minLength={6}
                  required
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}
              {success && (
                <div className="text-green-600 text-sm text-center">{success}</div>
              )}
              <InteractiveButton 
                type="submit" 
                variant="macos"
                className="w-full"
                withSpring={true}
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Conta'}
              </InteractiveButton>
              <InteractiveButton 
                type="button" 
                variant="outline"
                className="w-full"
                onClick={onBackToLogin}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Login
              </InteractiveButton>
            </form>
          </CardContent>
        </MacOSCardAnimated>
      </div>
    </MacOSFade>
  );
};

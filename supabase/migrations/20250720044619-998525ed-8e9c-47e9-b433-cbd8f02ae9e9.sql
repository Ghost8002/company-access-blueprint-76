
-- Remover as políticas RLS restritivas existentes
DROP POLICY IF EXISTS "Authenticated users can create companies" ON public.companies;
DROP POLICY IF EXISTS "Authorized users can update companies" ON public.companies;
DROP POLICY IF EXISTS "Root users can delete companies" ON public.companies;
DROP POLICY IF EXISTS "Users can view companies" ON public.companies;

-- Criar políticas mais permissivas para permitir importação
-- Permitir que todos os usuários autenticados vejam empresas
CREATE POLICY "Allow all authenticated users to view companies" 
  ON public.companies 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Permitir que todos os usuários autenticados criem empresas (temporário para importação)
CREATE POLICY "Allow all authenticated users to create companies" 
  ON public.companies 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Permitir que todos os usuários autenticados atualizem empresas (temporário para importação)
CREATE POLICY "Allow all authenticated users to update companies" 
  ON public.companies 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Permitir que apenas root delete empresas
CREATE POLICY "Only root can delete companies" 
  ON public.companies 
  FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'root'
    )
  );

-- Garantir que o usuário atual tenha um perfil manager
INSERT INTO public.profiles (id, name, email, role)
SELECT 
  auth.uid(),
  'Usuário Manager',
  'manager@example.com',
  'manager'
WHERE auth.uid() IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
  role = 'manager',
  updated_at = now();

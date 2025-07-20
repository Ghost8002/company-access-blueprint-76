
-- Remover as políticas RLS existentes
DROP POLICY IF EXISTS "Allow authenticated users to delete companies" ON public.companies;
DROP POLICY IF EXISTS "Allow authenticated users to insert companies" ON public.companies;
DROP POLICY IF EXISTS "Allow authenticated users to update companies" ON public.companies;
DROP POLICY IF EXISTS "Allow authenticated users to view companies" ON public.companies;

-- Criar novas políticas mais específicas baseadas no perfil do usuário
-- Permitir que usuários autenticados vejam todas as empresas
CREATE POLICY "Authenticated users can view companies" 
  ON public.companies 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Permitir que apenas root e manager criem empresas
CREATE POLICY "Root and managers can create companies" 
  ON public.companies 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('root', 'manager')
    )
  );

-- Permitir que apenas root e manager atualizem empresas
CREATE POLICY "Root and managers can update companies" 
  ON public.companies 
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('root', 'manager')
    )
  );

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

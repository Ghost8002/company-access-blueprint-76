
-- Primeiro, vamos criar uma função de segurança para verificar o papel do usuário
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(role, 'collaborator') FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Remover as políticas existentes
DROP POLICY IF EXISTS "Authenticated users can view companies" ON public.companies;
DROP POLICY IF EXISTS "Root and managers can create companies" ON public.companies;
DROP POLICY IF EXISTS "Root and managers can update companies" ON public.companies;
DROP POLICY IF EXISTS "Only root can delete companies" ON public.companies;

-- Criar políticas mais simples e robustas
CREATE POLICY "Users can view companies" 
  ON public.companies 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Política temporária mais permissiva para criação (para debug)
CREATE POLICY "Authenticated users can create companies" 
  ON public.companies 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Política para atualização baseada na função
CREATE POLICY "Authorized users can update companies" 
  ON public.companies 
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    public.get_current_user_role() IN ('root', 'manager')
  );

-- Política para exclusão apenas para root
CREATE POLICY "Root users can delete companies" 
  ON public.companies 
  FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND 
    public.get_current_user_role() = 'root'
  );

-- Garantir que existe um perfil para cada usuário autenticado
-- (caso não exista, criar um perfil padrão)
CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email,
    'manager'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para garantir perfil do usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.ensure_user_profile();

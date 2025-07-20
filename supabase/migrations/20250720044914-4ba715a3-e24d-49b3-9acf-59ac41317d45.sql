
-- Primeiro, vamos temporariamente desabilitar RLS completamente para permitir a importação
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Allow all authenticated users to view companies" ON public.companies;
DROP POLICY IF EXISTS "Allow all authenticated users to create companies" ON public.companies;
DROP POLICY IF EXISTS "Allow all authenticated users to update companies" ON public.companies;
DROP POLICY IF EXISTS "Only root can delete companies" ON public.companies;

-- Recriar as políticas de forma mais simples e robusta
-- Política para SELECT (visualizar)
CREATE POLICY "Enable read access for authenticated users" 
  ON public.companies 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Política para INSERT (criar) - mais permissiva para importação
CREATE POLICY "Enable insert access for authenticated users" 
  ON public.companies 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Política para UPDATE (atualizar)
CREATE POLICY "Enable update access for authenticated users" 
  ON public.companies 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para DELETE (apenas root)
CREATE POLICY "Enable delete access for root only" 
  ON public.companies 
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'root'
    )
  );

-- Reabilitar RLS com as novas políticas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Garantir que existe um usuário com perfil adequado
INSERT INTO public.profiles (id, name, email, role)
SELECT 
  auth.uid(),
  'Sistema Admin',
  COALESCE((auth.jwt() -> 'email')::text, 'admin@sistema.com'),
  'manager'
WHERE auth.uid() IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
  role = 'manager',
  updated_at = now();

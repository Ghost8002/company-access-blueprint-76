
-- Primeiro, vamos remover todas as tabelas e políticas existentes
DROP POLICY IF EXISTS "Enable delete access for root only" ON public.companies;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.companies;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.companies;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.companies;

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Remover as tabelas
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Remover funções existentes
DROP FUNCTION IF EXISTS public.get_current_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.ensure_user_profile() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Remover triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recriar a tabela profiles
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL DEFAULT 'Usuário',
  email text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'manager',
  sector text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Recriar a tabela companies
CREATE TABLE public.companies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL DEFAULT ''::text,
  tax_id text,
  cpf text,
  complexity_level text,
  client_class text,
  tax_regime text NOT NULL DEFAULT 'Simples Nacional'::text,
  new_tax_regime text,
  company_group text,
  classification text,
  municipality text,
  situation text,
  honorary_value numeric,
  company_sector text,
  segment text,
  fiscal_responsible text,
  pessoal_responsible text,
  contabil_responsible text,
  financeiro_responsible text,
  alerts text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Criar função para obter o papel do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(role, 'manager') FROM public.profiles WHERE id = auth.uid();
$$;

-- Criar função para garantir perfil do usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Criar trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Políticas mais simples e permissivas para profiles
CREATE POLICY "Allow authenticated users to view profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to insert profiles"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Políticas muito permissivas para companies (para permitir importação)
CREATE POLICY "Allow all authenticated users to view companies"
  ON public.companies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow all authenticated users to create companies"
  ON public.companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update companies"
  ON public.companies
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow managers and root to delete companies"
  ON public.companies
  FOR DELETE
  TO authenticated
  USING (public.get_current_user_role() IN ('manager', 'root'));

-- Criar um usuário de teste no profiles (será criado quando alguém se autenticar)
-- Isso será feito automaticamente pelo trigger quando um usuário se registrar

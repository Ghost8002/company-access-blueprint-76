
-- Criar enum para tipos de dados
CREATE TYPE public.complexity_level AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE public.client_class AS ENUM ('Executive', 'VIP', 'Diamond');
CREATE TYPE public.tax_regime AS ENUM ('Simples Nacional', 'Lucro Presumido', 'Lucro Real');
CREATE TYPE public.new_tax_regime AS ENUM ('LUCRO PRESUMIDO', 'LUCRO REAL', 'MEI', 'PF', 'SIMPLES NACIONAL', 'TERCEIRO SETOR');
CREATE TYPE public.company_group AS ENUM (
  'GRUPO ADEGA', 'GRUPO AGRICOLA GROENER', 'GRUPO ARI', 'GRUPO BRUNA', 'GRUPO BRUNO',
  'GRUPO CARLOS ALBERTO', 'GRUPO CARMO', 'GRUPO FELICIANO', 'GRUPO FRANCO CONSTRUÇÕES',
  'GRUPO GONÇALVES', 'GRUPO ISOLDINO', 'GRUPO JUNIOR DO POSTO', 'GRUPO KOLLING',
  'GRUPO LAURIUCH', 'GRUPO MEI (AMARANTE)', 'GRUPO RAIMUNDO', 'GRUPO RAMOS',
  'GRUPO REIS PANIFICADORA', 'GRUPO SHEILA', 'GRUPO SOARES', 'GRUPO TRENTINE',
  'GRUPO TRUCKAUTO', 'GRUPO VALDOMIRO'
);
CREATE TYPE public.company_classification AS ENUM ('AVANÇADO', 'BÁSICO', 'ESSENCIAL', 'EXECULTIVO', 'MASTER');
CREATE TYPE public.company_municipality AS ENUM (
  'AMARANTE DO MARANHÃO', 'ARAME', 'BARRA DO CORDA', 'BURITIRANA', 'FERNANDO FALÇÃO',
  'FORMOSA DA SERRA NEGRA', 'GRAJAÚ', 'IMPERATRIZ', 'REDENÇÃO', 'SITIO NOVO'
);
CREATE TYPE public.company_situation AS ENUM ('SEM MOVIMENTO', 'COM MOVIMENTO');
CREATE TYPE public.company_sector AS ENUM (
  'COMÉRCIO', 'INDÚSTRIA', 'PRODUTOR RURAL', 'SERVIÇOS', 'TERCEIRO SETOR',
  'CONSTRUÇÃO CIVIL', 'TECNOLOGIA', 'SAÚDE', 'EDUCAÇÃO', 'TRANSPORTE',
  'AGRONEGÓCIO', 'FINANCEIRO', 'ENERGIA', 'TELECOMUNICAÇÕES', 'OUTROS'
);
CREATE TYPE public.user_role AS ENUM ('root', 'manager', 'collaborator');
CREATE TYPE public.user_sector AS ENUM ('fiscal', 'pessoal', 'contabil', 'financeiro');

-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'collaborator',
  sector user_sector,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de empresas
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tax_id TEXT,
  cpf TEXT,
  complexity_level complexity_level,
  client_class client_class,
  tax_regime tax_regime,
  new_tax_regime new_tax_regime,
  company_group company_group,
  classification company_classification,
  municipality company_municipality,
  situation company_situation DEFAULT 'COM MOVIMENTO',
  honorary_value DECIMAL(10,2),
  company_sector company_sector,
  segment TEXT,
  fiscal_responsible TEXT,
  pessoal_responsible TEXT,
  contabil_responsible TEXT,
  financeiro_responsible TEXT,
  alerts TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de relacionamento entre empresas e colaboradores
CREATE TABLE public.company_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  collaborator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, collaborator_id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_collaborators ENABLE ROW LEVEL SECURITY;

-- Criar função para verificar se usuário tem acesso à empresa
CREATE OR REPLACE FUNCTION public.user_has_company_access(company_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_collaborators cc
    WHERE cc.company_id = $1 AND cc.collaborator_id = $2
  ) OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = $2 AND p.role IN ('root', 'manager')
  );
$$;

-- Criar função para obter role do usuário
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = $1;
$$;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Root users can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'root');

CREATE POLICY "Root users can create profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'root');

CREATE POLICY "Root users can update all profiles" ON public.profiles
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'root');

-- Políticas RLS para companies
CREATE POLICY "Users can view companies they have access to" ON public.companies
  FOR SELECT USING (
    public.get_user_role(auth.uid()) = 'root' OR
    public.user_has_company_access(id, auth.uid())
  );

CREATE POLICY "Root and managers can create companies" ON public.companies
  FOR INSERT WITH CHECK (
    public.get_user_role(auth.uid()) IN ('root', 'manager')
  );

CREATE POLICY "Root and managers can update companies" ON public.companies
  FOR UPDATE USING (
    public.get_user_role(auth.uid()) IN ('root', 'manager')
  );

CREATE POLICY "Root users can delete companies" ON public.companies
  FOR DELETE USING (public.get_user_role(auth.uid()) = 'root');

-- Políticas RLS para company_collaborators
CREATE POLICY "Users can view company collaborators for accessible companies" ON public.company_collaborators
  FOR SELECT USING (
    public.get_user_role(auth.uid()) = 'root' OR
    public.user_has_company_access(company_id, auth.uid())
  );

CREATE POLICY "Root and managers can manage company collaborators" ON public.company_collaborators
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('root', 'manager')
  );

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Criar função para manipular novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'collaborator'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir alguns dados iniciais
INSERT INTO public.profiles (id, name, email, role, sector) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Administrador', 'admin@sistema.com', 'root', 'contabil'),
  ('00000000-0000-0000-0000-000000000002', 'Gerente Fiscal', 'fiscal@sistema.com', 'manager', 'fiscal'),
  ('00000000-0000-0000-0000-000000000003', 'Colaborador', 'colab@sistema.com', 'collaborator', 'pessoal');

-- Inserir algumas empresas de exemplo
INSERT INTO public.companies (
  id, name, tax_id, complexity_level, client_class, tax_regime, new_tax_regime,
  company_group, classification, municipality, situation, honorary_value,
  company_sector, segment, fiscal_responsible, pessoal_responsible, contabil_responsible
) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'Tech Solutions Ltd',
    '12.345.678/0001-90',
    'High',
    'VIP',
    'Lucro Real',
    'LUCRO REAL',
    'GRUPO SOARES',
    'AVANÇADO',
    'IMPERATRIZ',
    'COM MOVIMENTO',
    2500.00,
    'SERVIÇOS',
    'INFORMÁTICA',
    'Gerente Fiscal',
    'Colaborador',
    'Administrador'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Marketing Pro',
    '98.765.432/0001-11',
    'Medium',
    'Executive',
    'Simples Nacional',
    'SIMPLES NACIONAL',
    'GRUPO CARLOS ALBERTO',
    'ESSENCIAL',
    'BARRA DO CORDA',
    'COM MOVIMENTO',
    1800.00,
    'SERVIÇOS',
    'CONSULTORIA',
    'Gerente Fiscal',
    'Colaborador',
    'Administrador'
  );

-- Inserir relacionamentos empresa-colaborador
INSERT INTO public.company_collaborators (company_id, collaborator_id) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003');

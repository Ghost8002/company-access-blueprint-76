-- ====================================
-- ESTRUTURA COMPLETA DO BANCO DE DADOS
-- Sistema de Gestão de Empresas e Inadimplência
-- ====================================

-- 1. TABELA DE PERFIS DE USUÁRIO
-- ====================================
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Usuário',
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('root', 'manager', 'collaborator')),
  sector TEXT CHECK (sector IN ('fiscal', 'pessoal', 'contabil', 'financeiro')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. TABELA DE EMPRESAS PRINCIPAL
-- ====================================
CREATE TABLE public.companies (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  tax_id TEXT,
  cpf TEXT,
  honorary_value NUMERIC,
  complexity_level TEXT CHECK (complexity_level IN ('Low', 'Medium', 'High')),
  client_class TEXT CHECK (client_class IN ('Executive', 'VIP', 'Diamond')),
  tax_regime TEXT NOT NULL DEFAULT 'Simples Nacional' CHECK (tax_regime IN ('Simples Nacional', 'Lucro Presumido', 'Lucro Real')),
  new_tax_regime TEXT CHECK (new_tax_regime IN ('Simples Nacional', 'Lucro Presumido', 'Lucro Real', 'MEI')),
  company_group TEXT,
  classification TEXT CHECK (classification IN ('Ativa', 'Inativa', 'Suspensa', 'Cancelada')),
  municipality TEXT,
  situation TEXT CHECK (situation IN ('Regular', 'Irregular', 'Suspensa', 'Baixada')),
  company_sector TEXT,
  segment TEXT,
  
  -- Responsáveis por setor
  fiscal_responsible TEXT,
  pessoal_responsible TEXT,
  contabil_responsible TEXT,
  financeiro_responsible TEXT,
  
  -- Campos de inadimplência
  delinquency_status TEXT NOT NULL DEFAULT 'sem_debitos' CHECK (delinquency_status IN ('inadimplente', 'sem_debitos')),
  delinquency_start_date TIMESTAMP WITH TIME ZONE,
  delinquency_end_date TIMESTAMP WITH TIME ZONE,
  
  -- Alertas
  alerts TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. HISTÓRICO DE INADIMPLÊNCIA
-- ====================================
CREATE TABLE public.delinquency_history (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('inadimplente', 'sem_debitos')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. RELATÓRIOS FINANCEIROS MENSAIS
-- ====================================
CREATE TABLE public.monthly_financial_reports (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  total_revenue NUMERIC NOT NULL DEFAULT 0,
  total_companies INTEGER NOT NULL DEFAULT 0,
  delinquent_companies INTEGER NOT NULL DEFAULT 0,
  revenue_without_delinquents NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(year, month)
);

-- 5. GRUPOS DE EMPRESAS
-- ====================================
CREATE TABLE public.company_groups (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. SEGMENTOS DE EMPRESAS
-- ====================================
CREATE TABLE public.company_segments (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ====================================
-- ÍNDICES PARA PERFORMANCE
-- ====================================

-- Índices para tabela companies
CREATE INDEX idx_companies_tax_regime ON public.companies(tax_regime);
CREATE INDEX idx_companies_company_group ON public.companies(company_group);
CREATE INDEX idx_companies_segment ON public.companies(segment);
CREATE INDEX idx_companies_delinquency_status ON public.companies(delinquency_status);
CREATE INDEX idx_companies_created_at ON public.companies(created_at);
CREATE INDEX idx_companies_honorary_value ON public.companies(honorary_value);

-- Índices para histórico de inadimplência
CREATE INDEX idx_delinquency_history_company_id ON public.delinquency_history(company_id);
CREATE INDEX idx_delinquency_history_status ON public.delinquency_history(status);
CREATE INDEX idx_delinquency_history_start_date ON public.delinquency_history(start_date);

-- Índices para relatórios financeiros
CREATE INDEX idx_monthly_reports_year_month ON public.monthly_financial_reports(year, month);

-- ====================================
-- FUNÇÕES AUXILIARES
-- ====================================

-- Função para obter role do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(role, 'manager') FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Função para calcular dias de inadimplência
CREATE OR REPLACE FUNCTION public.calculate_delinquency_days(company_id UUID)
RETURNS INTEGER AS $$
DECLARE
  days INTEGER := 0;
BEGIN
  SELECT COALESCE(
    EXTRACT(DAY FROM (
      CASE 
        WHEN c.delinquency_status = 'inadimplente' AND c.delinquency_start_date IS NOT NULL
        THEN now() - c.delinquency_start_date
        ELSE INTERVAL '0 days'
      END
    ))::INTEGER, 
    0
  )
  INTO days
  FROM public.companies c
  WHERE c.id = company_id;
  
  RETURN days;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Função para atualizar histórico de inadimplência
CREATE OR REPLACE FUNCTION public.handle_delinquency_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o status mudou
  IF OLD.delinquency_status IS DISTINCT FROM NEW.delinquency_status THEN
    -- Finalizar o registro anterior se existir
    IF OLD.delinquency_status IS NOT NULL THEN
      UPDATE public.delinquency_history 
      SET end_date = now()
      WHERE company_id = NEW.id 
        AND status = OLD.delinquency_status 
        AND end_date IS NULL;
    END IF;
    
    -- Criar novo registro
    INSERT INTO public.delinquency_history (company_id, status, start_date)
    VALUES (NEW.id, NEW.delinquency_status, COALESCE(NEW.delinquency_start_date, now()));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- TRIGGERS
-- ====================================

-- Trigger para histórico de inadimplência
CREATE TRIGGER on_delinquency_status_change
  AFTER UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_delinquency_status_change();

-- Triggers para atualizar updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_delinquency_history_updated_at
  BEFORE UPDATE ON public.delinquency_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para criação automática de perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ====================================
-- VIEWS PARA RELATÓRIOS
-- ====================================

-- View para ranking de segmentos
CREATE OR REPLACE VIEW public.segment_ranking AS
SELECT 
  segment,
  COUNT(*) as company_count,
  SUM(honorary_value) as total_honorary,
  AVG(honorary_value) as avg_honorary,
  COUNT(CASE WHEN delinquency_status = 'inadimplente' THEN 1 END) as delinquent_count
FROM public.companies 
WHERE segment IS NOT NULL AND honorary_value IS NOT NULL
GROUP BY segment
ORDER BY total_honorary DESC;

-- View para ranking de grupos
CREATE OR REPLACE VIEW public.group_ranking AS
SELECT 
  company_group,
  COUNT(*) as company_count,
  SUM(honorary_value) as total_honorary,
  AVG(honorary_value) as avg_honorary,
  COUNT(CASE WHEN delinquency_status = 'inadimplente' THEN 1 END) as delinquent_count
FROM public.companies 
WHERE company_group IS NOT NULL AND honorary_value IS NOT NULL
GROUP BY company_group
ORDER BY total_honorary DESC;

-- View para ranking de regime tributário
CREATE OR REPLACE VIEW public.tax_regime_ranking AS
SELECT 
  tax_regime,
  COUNT(*) as company_count,
  SUM(honorary_value) as total_honorary,
  AVG(honorary_value) as avg_honorary,
  COUNT(CASE WHEN delinquency_status = 'inadimplente' THEN 1 END) as delinquent_count
FROM public.companies 
WHERE honorary_value IS NOT NULL
GROUP BY tax_regime
ORDER BY total_honorary DESC;

-- ====================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ====================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delinquency_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_segments ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Allow authenticated users to view profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to insert profiles" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Políticas para companies
CREATE POLICY "Allow all authenticated users to view companies" ON public.companies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow all authenticated users to create companies" ON public.companies
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update companies" ON public.companies
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow managers and root to delete companies" ON public.companies
  FOR DELETE TO authenticated USING (get_current_user_role() = ANY(ARRAY['manager', 'root']));

-- Políticas para delinquency_history
CREATE POLICY "Allow authenticated users to view delinquency history" ON public.delinquency_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert delinquency history" ON public.delinquency_history
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update delinquency history" ON public.delinquency_history
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete delinquency history" ON public.delinquency_history
  FOR DELETE TO authenticated USING (true);

-- Políticas para monthly_financial_reports
CREATE POLICY "Allow authenticated users to view financial reports" ON public.monthly_financial_reports
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow managers to manage financial reports" ON public.monthly_financial_reports
  FOR ALL TO authenticated USING (get_current_user_role() = ANY(ARRAY['manager', 'root']));

-- Políticas para company_groups
CREATE POLICY "Allow authenticated users to view groups" ON public.company_groups
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow managers to manage groups" ON public.company_groups
  FOR ALL TO authenticated USING (get_current_user_role() = ANY(ARRAY['manager', 'root']));

-- Políticas para company_segments
CREATE POLICY "Allow authenticated users to view segments" ON public.company_segments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow managers to manage segments" ON public.company_segments
  FOR ALL TO authenticated USING (get_current_user_role() = ANY(ARRAY['manager', 'root']));

-- ====================================
-- DADOS INICIAIS (SEED DATA)
-- ====================================

-- Inserir grupos padrão
INSERT INTO public.company_groups (name, description) VALUES
('Grupo A', 'Empresas de grande porte'),
('Grupo B', 'Empresas de médio porte'),
('Grupo C', 'Empresas de pequeno porte'),
('Grupo Premium', 'Clientes VIP e executivos')
ON CONFLICT (name) DO NOTHING;

-- Inserir segmentos padrão
INSERT INTO public.company_segments (name, description) VALUES
('Comércio', 'Empresas do setor comercial'),
('Indústria', 'Empresas do setor industrial'),
('Serviços', 'Empresas prestadoras de serviços'),
('Tecnologia', 'Empresas de tecnologia'),
('Saúde', 'Empresas do setor de saúde'),
('Educação', 'Instituições educacionais'),
('Construção', 'Empresas de construção civil'),
('Agronegócio', 'Empresas do agronegócio')
ON CONFLICT (name) DO NOTHING;
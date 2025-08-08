-- ====================================
-- MIGRAÇÃO INCREMENTAL - NOVAS ESTRUTURAS
-- Sistema de Gestão de Empresas e Inadimplência
-- ====================================

-- 1. RELATÓRIOS FINANCEIROS MENSAIS
-- ====================================
CREATE TABLE IF NOT EXISTS public.monthly_financial_reports (
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

-- 2. GRUPOS DE EMPRESAS
-- ====================================
CREATE TABLE IF NOT EXISTS public.company_groups (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. SEGMENTOS DE EMPRESAS
-- ====================================
CREATE TABLE IF NOT EXISTS public.company_segments (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ====================================
-- NOVOS ÍNDICES PARA PERFORMANCE
-- ====================================

-- Índices para relatórios financeiros
CREATE INDEX IF NOT EXISTS idx_monthly_reports_year_month ON public.monthly_financial_reports(year, month);

-- ====================================
-- FUNÇÃO PARA CALCULAR DIAS DE INADIMPLÊNCIA
-- ====================================
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

-- ====================================
-- VIEWS PARA RELATÓRIOS E RANKINGS
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
-- POLÍTICAS RLS PARA NOVAS TABELAS
-- ====================================

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.monthly_financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_segments ENABLE ROW LEVEL SECURITY;

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
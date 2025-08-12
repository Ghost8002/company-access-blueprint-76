-- Estrutura completa de banco de dados para o sistema de gestão de empresas

-- 1. Primeiro, vamos garantir que todas as colunas necessárias existam na tabela companies
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS collaborator_ids text[] DEFAULT '{}';

-- 2. Criar tabela de colaboradores se não existir
CREATE TABLE IF NOT EXISTS public.collaborators (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE,
  role text DEFAULT 'collaborator',
  sector text,
  active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. Criar tabela de relacionamento empresa-colaborador
CREATE TABLE IF NOT EXISTS public.company_collaborators (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  collaborator_id uuid NOT NULL REFERENCES public.collaborators(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(company_id, collaborator_id)
);

-- 4. Criar tabela de alertas do sistema
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  severity text DEFAULT 'info', -- info, warning, error
  is_read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone
);

-- 5. Criar tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 6. Atualizar tabela de usuários se necessário
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_login timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- 7. Habilitar RLS em todas as novas tabelas
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 8. Criar políticas RLS para colaboradores
CREATE POLICY "Allow authenticated users to view collaborators" 
ON public.collaborators 
FOR SELECT 
USING (true);

CREATE POLICY "Allow managers to manage collaborators" 
ON public.collaborators 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['manager'::text, 'root'::text]));

-- 9. Criar políticas RLS para relacionamento empresa-colaborador
CREATE POLICY "Allow authenticated users to view company collaborators" 
ON public.company_collaborators 
FOR SELECT 
USING (true);

CREATE POLICY "Allow managers to manage company collaborators" 
ON public.company_collaborators 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['manager'::text, 'root'::text]));

-- 10. Criar políticas RLS para alertas
CREATE POLICY "Allow users to view relevant alerts" 
ON public.system_alerts 
FOR SELECT 
USING (true);

CREATE POLICY "Allow managers to manage alerts" 
ON public.system_alerts 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['manager'::text, 'root'::text]));

-- 11. Criar políticas RLS para configurações do sistema
CREATE POLICY "Allow authenticated users to view settings" 
ON public.system_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Allow managers to manage settings" 
ON public.system_settings 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['manager'::text, 'root'::text]));

-- 12. Criar função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Criar triggers para atualizar timestamps automaticamente
CREATE TRIGGER update_collaborators_updated_at
  BEFORE UPDATE ON public.collaborators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 14. Inserir algumas configurações padrão do sistema
INSERT INTO public.system_settings (key, value, description) VALUES
('app_name', '"Sistema de Gestão Empresarial"', 'Nome da aplicação'),
('default_tax_regime', '"Simples Nacional"', 'Regime tributário padrão para novas empresas'),
('delinquency_alert_days', '30', 'Dias para alerta de inadimplência'),
('currency', '"BRL"', 'Moeda padrão do sistema'),
('date_format', '"dd/MM/yyyy"', 'Formato de data padrão')
ON CONFLICT (key) DO NOTHING;

-- 15. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_tax_id ON public.companies(tax_id);
CREATE INDEX IF NOT EXISTS idx_companies_delinquency_status ON public.companies(delinquency_status);
CREATE INDEX IF NOT EXISTS idx_companies_company_group ON public.companies(company_group);
CREATE INDEX IF NOT EXISTS idx_companies_segment ON public.companies(segment);
CREATE INDEX IF NOT EXISTS idx_company_collaborators_company_id ON public.company_collaborators(company_id);
CREATE INDEX IF NOT EXISTS idx_system_alerts_company_id ON public.system_alerts(company_id);
CREATE INDEX IF NOT EXISTS idx_system_alerts_created_at ON public.system_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_delinquency_history_company_id ON public.delinquency_history(company_id);

-- 16. Adicionar comentários nas tabelas para documentação
COMMENT ON TABLE public.companies IS 'Tabela principal de empresas do sistema';
COMMENT ON TABLE public.collaborators IS 'Colaboradores que podem ser associados às empresas';
COMMENT ON TABLE public.company_collaborators IS 'Relacionamento muitos-para-muitos entre empresas e colaboradores';
COMMENT ON TABLE public.system_alerts IS 'Alertas do sistema para empresas e usuários';
COMMENT ON TABLE public.system_settings IS 'Configurações globais do sistema';
COMMENT ON TABLE public.delinquency_history IS 'Histórico de inadimplência das empresas';
COMMENT ON TABLE public.monthly_financial_reports IS 'Relatórios financeiros mensais consolidados';
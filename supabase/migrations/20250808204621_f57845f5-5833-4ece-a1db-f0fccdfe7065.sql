-- ====================================
-- CORREÇÃO DE PROBLEMAS DE SEGURANÇA
-- ====================================

-- Corrigir funções com search_path mutable e views security definer
-- 1. Recrear função get_current_user_role com search_path seguro
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(role, 'manager') FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Recrear função calculate_delinquency_days com search_path seguro
CREATE OR REPLACE FUNCTION public.calculate_delinquency_days(company_id UUID)
RETURNS INTEGER 
LANGUAGE plpgsql 
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- 3. Recrear função handle_delinquency_status_change com search_path seguro
CREATE OR REPLACE FUNCTION public.handle_delinquency_status_change()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- 4. Recrear função handle_new_user com search_path seguro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

-- 5. Recriar views sem SECURITY DEFINER (usar SECURITY INVOKER que é o padrão)
DROP VIEW IF EXISTS public.segment_ranking;
CREATE VIEW public.segment_ranking AS
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

DROP VIEW IF EXISTS public.group_ranking;
CREATE VIEW public.group_ranking AS
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

DROP VIEW IF EXISTS public.tax_regime_ranking;
CREATE VIEW public.tax_regime_ranking AS
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
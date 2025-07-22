
-- Adicionar campo de inadimplência na tabela companies
ALTER TABLE public.companies 
ADD COLUMN delinquency_status TEXT CHECK (delinquency_status IN ('inadimplente', 'sem_debitos')) DEFAULT 'sem_debitos',
ADD COLUMN delinquency_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN delinquency_end_date TIMESTAMP WITH TIME ZONE;

-- Criar tabela para histórico de inadimplência
CREATE TABLE public.delinquency_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('inadimplente', 'sem_debitos')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de histórico de inadimplência
ALTER TABLE public.delinquency_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para delinquency_history
CREATE POLICY "Allow authenticated users to view delinquency history" ON public.delinquency_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert delinquency history" ON public.delinquency_history
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update delinquency history" ON public.delinquency_history
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete delinquency history" ON public.delinquency_history
  FOR DELETE TO authenticated USING (true);

-- Função para atualizar automaticamente o histórico quando o status muda
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

-- Trigger para executar a função
CREATE TRIGGER on_delinquency_status_change
  AFTER UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_delinquency_status_change();

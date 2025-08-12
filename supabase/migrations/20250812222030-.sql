-- Atualizar políticas RLS para permitir operações sem autenticação estrita

-- Remover políticas restritivas antigas das empresas
DROP POLICY IF EXISTS "Allow all authenticated users to create companies" ON public.companies;
DROP POLICY IF EXISTS "Allow all authenticated users to update companies" ON public.companies;
DROP POLICY IF EXISTS "Allow all authenticated users to view companies" ON public.companies;

-- Criar políticas mais permissivas para empresas
CREATE POLICY "Allow public access to view companies" 
ON public.companies 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public access to create companies" 
ON public.companies 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public access to update companies" 
ON public.companies 
FOR UPDATE 
USING (true);

-- Atualizar políticas para grupos e segmentos
DROP POLICY IF EXISTS "Allow authenticated users to view groups" ON public.company_groups;
DROP POLICY IF EXISTS "Allow authenticated users to view segments" ON public.company_segments;

CREATE POLICY "Allow public access to view groups" 
ON public.company_groups 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public access to view segments" 
ON public.company_segments 
FOR SELECT 
USING (true);
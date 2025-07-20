
-- Create companies table with all the required fields
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tax_id TEXT,
  cpf TEXT,
  complexity_level TEXT CHECK (complexity_level IN ('Low', 'Medium', 'High')),
  client_class TEXT CHECK (client_class IN ('Executive', 'VIP', 'Diamond')),
  tax_regime TEXT NOT NULL DEFAULT 'Simples Nacional' CHECK (tax_regime IN ('Simples Nacional', 'Lucro Presumido', 'Lucro Real')),
  new_tax_regime TEXT CHECK (new_tax_regime IN ('LUCRO PRESUMIDO', 'LUCRO REAL', 'MEI', 'PF', 'SIMPLES NACIONAL', 'TERCEIRO SETOR')),
  company_group TEXT,
  classification TEXT CHECK (classification IN ('AVANÇADO', 'BÁSICO', 'ESSENCIAL', 'EXECULTIVO', 'MASTER')),
  municipality TEXT,
  situation TEXT CHECK (situation IN ('SEM MOVIMENTO', 'COM MOVIMENTO')),
  honorary_value DECIMAL(10,2),
  company_sector TEXT,
  segment TEXT,
  fiscal_responsible TEXT,
  pessoal_responsible TEXT,
  contabil_responsible TEXT,
  financeiro_responsible TEXT,
  alerts TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user authentication
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('root', 'manager', 'collaborator')),
  sector TEXT CHECK (sector IN ('fiscal', 'pessoal', 'contabil', 'financeiro')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for companies (allow all authenticated users for now)
CREATE POLICY "Allow authenticated users to view companies" ON public.companies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert companies" ON public.companies
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update companies" ON public.companies
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete companies" ON public.companies
  FOR DELETE TO authenticated USING (true);

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    'collaborator'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

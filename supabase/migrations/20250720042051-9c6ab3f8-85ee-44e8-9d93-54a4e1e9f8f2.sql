
-- Let's ensure all necessary columns exist in the companies table with proper types
-- First, let's check if we need to add any missing columns or update existing ones

-- Add any missing columns that might be referenced in the code
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS tax_id text,
ADD COLUMN IF NOT EXISTS cpf text,
ADD COLUMN IF NOT EXISTS complexity_level text,
ADD COLUMN IF NOT EXISTS client_class text,
ADD COLUMN IF NOT EXISTS tax_regime text NOT NULL DEFAULT 'Simples Nacional',
ADD COLUMN IF NOT EXISTS segment text,
ADD COLUMN IF NOT EXISTS new_tax_regime text,
ADD COLUMN IF NOT EXISTS company_group text,
ADD COLUMN IF NOT EXISTS classification text,
ADD COLUMN IF NOT EXISTS municipality text,
ADD COLUMN IF NOT EXISTS situation text,
ADD COLUMN IF NOT EXISTS honorary_value numeric,
ADD COLUMN IF NOT EXISTS company_sector text,
ADD COLUMN IF NOT EXISTS fiscal_responsible text,
ADD COLUMN IF NOT EXISTS pessoal_responsible text,
ADD COLUMN IF NOT EXISTS contabil_responsible text,
ADD COLUMN IF NOT EXISTS financeiro_responsible text,
ADD COLUMN IF NOT EXISTS alerts text[];

-- Ensure the profiles table has all necessary columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS email text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'collaborator',
ADD COLUMN IF NOT EXISTS sector text;

-- Update any existing default values to ensure consistency
ALTER TABLE public.companies ALTER COLUMN name SET DEFAULT '';
ALTER TABLE public.companies ALTER COLUMN tax_regime SET DEFAULT 'Simples Nacional';

-- Ensure RLS is enabled on both tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

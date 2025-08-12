-- Atualizar configurações de autenticação para permitir login sem confirmação de email

-- 1. Confirmar automaticamente todos os usuários existentes que não foram confirmados
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 2. Inserir configuração para desabilitar confirmação de email
-- Esta configuração deve ser feita no dashboard do Supabase, mas vamos documentar aqui
-- Caminho: Authentication > Settings > Email Auth > Confirm email = OFF
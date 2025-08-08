-- ====================================
-- DADOS MOCADOS PARA ANÁLISE
-- Sistema de Gestão de Empresas e Inadimplência
-- ====================================

-- 1. INSERIR EMPRESAS COM DADOS VARIADOS
-- ====================================
INSERT INTO public.companies (
  name, tax_id, honorary_value, complexity_level, client_class, tax_regime, 
  new_tax_regime, company_group, classification, municipality, situation, 
  company_sector, segment, fiscal_responsible, pessoal_responsible, 
  contabil_responsible, financeiro_responsible, delinquency_status, 
  delinquency_start_date, created_at
) VALUES
-- Empresas do Grupo A (Grande Porte)
('Tech Solutions LTDA', '12.345.678/0001-90', 25000.00, 'High', 'Executive', 'Lucro Real', 'Lucro Real', 'Grupo A', 'Ativa', 'São Paulo', 'Regular', 'Tecnologia', 'Tecnologia', 'João Silva', 'Maria Santos', 'Carlos Lima', 'Ana Costa', 'sem_debitos', NULL, '2023-01-15'),
('Industria Global S.A.', '23.456.789/0001-01', 45000.00, 'High', 'VIP', 'Lucro Real', 'Lucro Real', 'Grupo A', 'Ativa', 'Rio de Janeiro', 'Regular', 'Industrial', 'Indústria', 'Pedro Oliveira', 'Lucia Ferreira', 'Roberto Alves', 'Fernanda Cruz', 'inadimplente', '2024-06-01', '2023-02-20'),
('Construtora Mega Corp', '34.567.890/0001-12', 35000.00, 'High', 'Diamond', 'Lucro Presumido', 'Lucro Real', 'Grupo A', 'Ativa', 'Belo Horizonte', 'Regular', 'Construção', 'Construção', 'Ricardo Souza', 'Juliana Rocha', 'Marcos Pereira', 'Gabriela Lima', 'sem_debitos', NULL, '2023-03-10'),

-- Empresas do Grupo B (Médio Porte)
('Comercial Center LTDA', '45.678.901/0001-23', 15000.00, 'Medium', 'Executive', 'Simples Nacional', 'Lucro Presumido', 'Grupo B', 'Ativa', 'Porto Alegre', 'Regular', 'Comércio', 'Comércio', 'André Silva', 'Patricia Gomes', 'Felipe Santos', 'Marina Dias', 'sem_debitos', NULL, '2023-04-05'),
('Saúde e Vida Clínica', '56.789.012/0001-34', 20000.00, 'Medium', 'VIP', 'Simples Nacional', 'Simples Nacional', 'Grupo B', 'Ativa', 'Salvador', 'Regular', 'Saúde', 'Saúde', 'Bruno Costa', 'Carla Mendes', 'Diego Ribeiro', 'Renata Silva', 'inadimplente', '2024-07-15', '2023-05-12'),
('Educacional Futuro', '67.890.123/0001-45', 18000.00, 'Medium', 'Executive', 'Simples Nacional', 'Simples Nacional', 'Grupo B', 'Ativa', 'Recife', 'Regular', 'Educação', 'Educação', 'Eduardo Martins', 'Luciana Barbosa', 'Thiago Lopes', 'Vanessa Reis', 'sem_debitos', NULL, '2023-06-08'),

-- Empresas do Grupo C (Pequeno Porte)
('Serviços Express ME', '78.901.234/0001-56', 8000.00, 'Low', 'Executive', 'Simples Nacional', 'MEI', 'Grupo C', 'Ativa', 'Fortaleza', 'Regular', 'Serviços', 'Serviços', 'Gabriel Farias', 'Amanda Torres', 'Leonardo Pinto', 'Bruna Cardoso', 'sem_debitos', NULL, '2023-07-20'),
('Agro Campos LTDA', '89.012.345/0001-67', 12000.00, 'Medium', 'VIP', 'Simples Nacional', 'Simples Nacional', 'Grupo C', 'Ativa', 'Curitiba', 'Regular', 'Agronegócio', 'Agronegócio', 'Henrique Moreira', 'Claudia Nascimento', 'Vinicius Teixeira', 'Larissa Fernandes', 'inadimplente', '2024-05-20', '2023-08-15'),
('Tech Startup EIRELI', '90.123.456/0001-78', 10000.00, 'Low', 'Diamond', 'Simples Nacional', 'Simples Nacional', 'Grupo C', 'Ativa', 'Brasília', 'Regular', 'Tecnologia', 'Tecnologia', 'Igor Castro', 'Debora Correia', 'Rafael Machado', 'Camila Freitas', 'sem_debitos', NULL, '2023-09-30'),

-- Empresas Grupo Premium
('Consultoria Elite S.A.', '01.234.567/0001-89', 60000.00, 'High', 'Diamond', 'Lucro Real', 'Lucro Real', 'Grupo Premium', 'Ativa', 'São Paulo', 'Regular', 'Consultoria', 'Serviços', 'Alexandre Vieira', 'Isabella Monteiro', 'Gustavo Ramos', 'Natalia Cunha', 'sem_debitos', NULL, '2023-10-10'),
('Holding Investimentos', '11.234.567/0001-90', 80000.00, 'High', 'Diamond', 'Lucro Real', 'Lucro Real', 'Grupo Premium', 'Ativa', 'Rio de Janeiro', 'Regular', 'Financeiro', 'Serviços', 'Rodrigo Assis', 'Priscila Duarte', 'Mateus Campos', 'Tatiana Moura', 'inadimplente', '2024-08-01', '2023-11-05'),

-- Empresas com diferentes situações
('Empresa Suspensa LTDA', '21.345.678/0001-01', 5000.00, 'Low', 'Executive', 'Simples Nacional', 'Simples Nacional', 'Grupo C', 'Suspensa', 'Goiânia', 'Suspensa', 'Comércio', 'Comércio', 'Carlos Mendes', 'Silvia Araujo', 'Lucas Barros', 'Paula Santana', 'inadimplente', '2024-01-15', '2023-12-01'),
('Comércio Irregular ME', '32.456.789/0001-12', 7000.00, 'Low', 'Executive', 'Simples Nacional', 'Simples Nacional', 'Grupo C', 'Ativa', 'Manaus', 'Irregular', 'Comércio', 'Comércio', 'Fernando Luz', 'Aline Moura', 'Juliano Costa', 'Roberta Lima', 'inadimplente', '2024-03-10', '2024-01-20'),

-- Mais empresas para análise estatística
('Metalúrgica Industrial', '43.567.890/0001-23', 28000.00, 'High', 'VIP', 'Lucro Presumido', 'Lucro Real', 'Grupo A', 'Ativa', 'São Paulo', 'Regular', 'Industrial', 'Indústria', 'Sergio Machado', 'Viviane Leal', 'Cesar Batista', 'Monica Reis', 'sem_debitos', NULL, '2024-02-14'),
('Farmácia Popular LTDA', '54.678.901/0001-34', 9500.00, 'Medium', 'Executive', 'Simples Nacional', 'Simples Nacional', 'Grupo B', 'Ativa', 'Campinas', 'Regular', 'Saúde', 'Saúde', 'Marcelo Ribeiro', 'Elaine Cardoso', 'Fábio Gomes', 'Jacqueline Silva', 'sem_debitos', NULL, '2024-03-01'),
('Escola Crescer Bem', '65.789.012/0001-45', 11000.00, 'Medium', 'VIP', 'Simples Nacional', 'Simples Nacional', 'Grupo B', 'Ativa', 'Santos', 'Regular', 'Educação', 'Educação', 'Paulo Henrique', 'Rosana Oliveira', 'Daniel Souza', 'Cintia Almeida', 'inadimplente', '2024-04-05', '2024-03-15'),
('Transporte Rápido S.A.', '76.890.123/0001-56', 22000.00, 'Medium', 'Executive', 'Lucro Presumido', 'Lucro Presumido', 'Grupo B', 'Ativa', 'Ribeirão Preto', 'Regular', 'Logística', 'Serviços', 'Cristiano Martins', 'Adriana Fonseca', 'Leandro Dias', 'Simone Castro', 'sem_debitos', NULL, '2024-04-20');

-- 2. INSERIR HISTÓRICO DE INADIMPLÊNCIA DETALHADO
-- ====================================
INSERT INTO public.delinquency_history (company_id, status, start_date, end_date, notes) VALUES
-- Histórico da Industria Global S.A.
((SELECT id FROM public.companies WHERE name = 'Industria Global S.A.'), 'sem_debitos', '2023-02-20', '2024-05-31', 'Período regular inicial'),
((SELECT id FROM public.companies WHERE name = 'Industria Global S.A.'), 'inadimplente', '2024-06-01', NULL, 'Atraso em pagamentos devido a dificuldades no fluxo de caixa'),

-- Histórico da Saúde e Vida Clínica
((SELECT id FROM public.companies WHERE name = 'Saúde e Vida Clínica'), 'sem_debitos', '2023-05-12', '2024-07-14', 'Histórico de pagamentos em dia'),
((SELECT id FROM public.companies WHERE name = 'Saúde e Vida Clínica'), 'inadimplente', '2024-07-15', NULL, 'Inadimplência por conta de redução na demanda'),

-- Histórico da Agro Campos LTDA
((SELECT id FROM public.companies WHERE name = 'Agro Campos LTDA'), 'sem_debitos', '2023-08-15', '2024-05-19', 'Pagamentos regulares'),
((SELECT id FROM public.companies WHERE name = 'Agro Campos LTDA'), 'inadimplente', '2024-05-20', NULL, 'Problemas sazonais no agronegócio'),

-- Histórico da Holding Investimentos
((SELECT id FROM public.companies WHERE name = 'Holding Investimentos'), 'sem_debitos', '2023-11-05', '2024-07-31', 'Cliente premium com histórico excelente'),
((SELECT id FROM public.companies WHERE name = 'Holding Investimentos'), 'inadimplente', '2024-08-01', NULL, 'Reestruturação financeira em andamento'),

-- Histórico da Empresa Suspensa LTDA
((SELECT id FROM public.companies WHERE name = 'Empresa Suspensa LTDA'), 'sem_debitos', '2023-12-01', '2024-01-14', 'Período inicial regular'),
((SELECT id FROM public.companies WHERE name = 'Empresa Suspensa LTDA'), 'inadimplente', '2024-01-15', NULL, 'Empresa com atividades suspensas'),

-- Histórico do Comércio Irregular ME
((SELECT id FROM public.companies WHERE name = 'Comércio Irregular ME'), 'sem_debitos', '2024-01-20', '2024-03-09', 'Período inicial de pagamentos regulares'),
((SELECT id FROM public.companies WHERE name = 'Comércio Irregular ME'), 'inadimplente', '2024-03-10', NULL, 'Irregularidades fiscais afetando pagamentos'),

-- Histórico da Escola Crescer Bem
((SELECT id FROM public.companies WHERE name = 'Escola Crescer Bem'), 'sem_debitos', '2024-03-15', '2024-04-04', 'Início com pagamentos em dia'),
((SELECT id FROM public.companies WHERE name = 'Escola Crescer Bem'), 'inadimplente', '2024-04-05', NULL, 'Redução de matrículas impactou fluxo de caixa');

-- 3. RELATÓRIOS FINANCEIROS MENSAIS (2023-2024)
-- ====================================
INSERT INTO public.monthly_financial_reports (year, month, total_revenue, total_companies, delinquent_companies, revenue_without_delinquents) VALUES
-- 2023
(2023, 1, 85000.00, 5, 0, 85000.00),
(2023, 2, 110000.00, 7, 0, 110000.00),
(2023, 3, 145000.00, 9, 0, 145000.00),
(2023, 4, 160000.00, 10, 0, 160000.00),
(2023, 5, 180000.00, 11, 0, 180000.00),
(2023, 6, 198000.00, 12, 0, 198000.00),
(2023, 7, 206000.00, 13, 0, 206000.00),
(2023, 8, 218000.00, 14, 0, 218000.00),
(2023, 9, 228000.00, 15, 0, 228000.00),
(2023, 10, 288000.00, 16, 0, 288000.00),
(2023, 11, 368000.00, 17, 0, 368000.00),
(2023, 12, 373000.00, 18, 1, 368000.00),

-- 2024
(2024, 1, 373000.00, 18, 1, 368000.00),
(2024, 2, 401000.00, 19, 1, 373000.00),
(2024, 3, 408000.00, 20, 2, 401000.00),
(2024, 4, 419000.00, 21, 3, 408000.00),
(2024, 5, 419000.00, 21, 4, 407000.00),
(2024, 6, 419000.00, 21, 5, 374000.00),
(2024, 7, 419000.00, 21, 6, 354000.00),
(2024, 8, 419000.00, 21, 7, 274000.00),
(2024, 9, 419000.00, 21, 7, 274000.00),
(2024, 10, 419000.00, 21, 7, 274000.00),
(2024, 11, 419000.00, 21, 7, 274000.00),
(2024, 12, 419000.00, 21, 7, 274000.00);
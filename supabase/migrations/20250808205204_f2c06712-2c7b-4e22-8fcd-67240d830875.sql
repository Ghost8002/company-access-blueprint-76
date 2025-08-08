-- ====================================
-- INSERÇÃO DE DADOS MOCADOS PARA ANÁLISE
-- ====================================

-- Inserir grupos de empresas
INSERT INTO public.company_groups (name, description) VALUES
('Grupo Alpha', 'Empresas de grande porte do setor tecnológico'),
('Grupo Beta', 'Empresas de médio porte do setor financeiro'),
('Grupo Gamma', 'Empresas do setor de varejo'),
('Grupo Delta', 'Empresas do setor industrial'),
('Grupo Omega', 'Empresas do setor de serviços');

-- Inserir segmentos
INSERT INTO public.company_segments (name, description) VALUES
('Tecnologia', 'Empresas de desenvolvimento de software e TI'),
('Varejo', 'Empresas de comércio e vendas'),
('Serviços', 'Empresas prestadoras de serviços diversos'),
('Indústria', 'Empresas de manufatura e produção'),
('Financeiro', 'Bancos, seguradoras e fintechs'),
('Saúde', 'Clínicas, hospitais e farmácias'),
('Educação', 'Escolas, universidades e cursos');

-- Inserir empresas mocadas com dados variados
INSERT INTO public.companies (
    name, tax_id, cpf, complexity_level, client_class, tax_regime, new_tax_regime,
    company_group, classification, municipality, situation, company_sector, segment,
    honorary_value, delinquency_status, delinquency_start_date,
    fiscal_responsible, pessoal_responsible, contabil_responsible, financeiro_responsible
) VALUES
-- Empresas do Grupo Alpha (Tecnologia)
('TechCorp Ltda', '12.345.678/0001-90', NULL, 'High', 'Diamond', 'Lucro Real', 'Lucro Real', 'Grupo Alpha', 'Grande Empresa', 'São Paulo', 'Ativa', 'Tecnologia', 'Tecnologia', 15000.00, 'sem_debitos', NULL, 'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa'),
('InnovaSoft S.A.', '23.456.789/0001-01', NULL, 'High', 'VIP', 'Lucro Real', 'Lucro Real', 'Grupo Alpha', 'Grande Empresa', 'São Paulo', 'Ativa', 'Tecnologia', 'Tecnologia', 12000.00, 'inadimplente', '2024-01-15', 'Carlos Lima', 'Lucia Ferreira', 'Roberto Souza', 'Fernanda Dias'),
('DevSolutions', '34.567.890/0001-12', NULL, 'Medium', 'Executive', 'Lucro Presumido', 'Lucro Presumido', 'Grupo Alpha', 'Média Empresa', 'Campinas', 'Ativa', 'Tecnologia', 'Tecnologia', 8000.00, 'sem_debitos', NULL, 'Marcos Reis', 'Julia Mendes', 'Andre Cunha', 'Patricia Rocha'),

-- Empresas do Grupo Beta (Financeiro)
('FinanceMax', '45.678.901/0001-23', NULL, 'High', 'Diamond', 'Lucro Real', 'Lucro Real', 'Grupo Beta', 'Grande Empresa', 'Rio de Janeiro', 'Ativa', 'Financeiro', 'Financeiro', 18000.00, 'sem_debitos', NULL, 'Rafael Torres', 'Camila Barbosa', 'Eduardo Melo', 'Isabela Franco'),
('CreditPlus S.A.', '56.789.012/0001-34', NULL, 'Medium', 'VIP', 'Lucro Presumido', 'Lucro Real', 'Grupo Beta', 'Média Empresa', 'Belo Horizonte', 'Ativa', 'Financeiro', 'Financeiro', 10000.00, 'inadimplente', '2024-02-10', 'Bruno Campos', 'Renata Silva', 'Gustavo Pereira', 'Monica Alves'),

-- Empresas do Grupo Gamma (Varejo)
('MegaStore Ltda', '67.890.123/0001-45', NULL, 'Medium', 'Executive', 'Simples Nacional', 'Simples Nacional', 'Grupo Gamma', 'Média Empresa', 'Porto Alegre', 'Ativa', 'Comércio', 'Varejo', 5000.00, 'sem_debitos', NULL, 'Diego Martins', 'Carla Nunes', 'Felipe Castro', 'Larissa Gomes'),
('ShopCenter', '78.901.234/0001-56', NULL, 'Low', 'Executive', 'Simples Nacional', 'Simples Nacional', 'Grupo Gamma', 'Pequena Empresa', 'Curitiba', 'Ativa', 'Comércio', 'Varejo', 3000.00, 'inadimplente', '2024-03-05', 'Lucas Vieira', 'Daniela Costa', 'Thiago Araujo', 'Vanessa Lopes'),
('FastMarket', '89.012.345/0001-67', NULL, 'Low', 'Executive', 'Simples Nacional', 'MEI', 'Grupo Gamma', 'Micro Empresa', 'Florianópolis', 'Ativa', 'Comércio', 'Varejo', 2000.00, 'sem_debitos', NULL, 'Alex Santos', 'Priscila Lima', 'Rodrigo Machado', 'Tatiana Pinto'),

-- Empresas do Grupo Delta (Indústria)
('IndustrialMax', '90.123.456/0001-78', NULL, 'High', 'Diamond', 'Lucro Real', 'Lucro Real', 'Grupo Delta', 'Grande Empresa', 'São Paulo', 'Ativa', 'Industrial', 'Indústria', 20000.00, 'sem_debitos', NULL, 'Ricardo Moura', 'Adriana Fonseca', 'Sergio Batista', 'Claudia Ribeiro'),
('ManufacturingCorp', '01.234.567/0001-89', NULL, 'Medium', 'VIP', 'Lucro Presumido', 'Lucro Real', 'Grupo Delta', 'Média Empresa', 'São Bernardo', 'Ativa', 'Industrial', 'Indústria', 14000.00, 'inadimplente', '2024-01-20', 'Fabio Cardoso', 'Simone Teixeira', 'Marcelo Freitas', 'Bianca Correia'),

-- Empresas do Grupo Omega (Serviços)
('ServicePro Ltda', '12.345.678/0001-91', NULL, 'Medium', 'Executive', 'Lucro Presumido', 'Lucro Presumido', 'Grupo Omega', 'Média Empresa', 'Brasília', 'Ativa', 'Serviços', 'Serviços', 7000.00, 'sem_debitos', NULL, 'Henrique Morais', 'Natalia Ramos', 'Vinicius Leite', 'Cristina Duarte'),
('ConsultPlus', '23.456.789/0001-02', NULL, 'High', 'VIP', 'Lucro Real', 'Lucro Real', 'Grupo Omega', 'Grande Empresa', 'Salvador', 'Ativa', 'Serviços', 'Serviços', 11000.00, 'inadimplente', '2024-02-28', 'Paulo Santana', 'Michelle Carvalho', 'Leonardo Nascimento', 'Gabriela Monteiro'),

-- Empresas do setor de Saúde (sem grupo específico)
('HealthCare Plus', '34.567.890/0001-13', NULL, 'High', 'Diamond', 'Lucro Real', 'Lucro Real', NULL, 'Grande Empresa', 'Recife', 'Ativa', 'Saúde', 'Saúde', 16000.00, 'sem_debitos', NULL, 'Daniel Silveira', 'Caroline Mendes', 'Juliano Torres', 'Amanda Rocha'),
('MediCorp Ltda', '45.678.901/0001-24', NULL, 'Medium', 'VIP', 'Lucro Presumido', 'Lucro Real', NULL, 'Média Empresa', 'Fortaleza', 'Ativa', 'Saúde', 'Saúde', 9000.00, 'inadimplente', '2024-03-10', 'Cesar Azevedo', 'Beatriz Soares', 'Otavio Guedes', 'Raquel Fernandes'),

-- Empresas do setor de Educação
('EduTech Solutions', '56.789.012/0001-35', NULL, 'Medium', 'Executive', 'Simples Nacional', 'Lucro Presumido', NULL, 'Média Empresa', 'Manaus', 'Ativa', 'Educação', 'Educação', 6000.00, 'sem_debitos', NULL, 'Alberto Reis', 'Sabrina Campos', 'Murilo Dias', 'Helena Castro'),
('Learning Center', '67.890.123/0001-46', NULL, 'Low', 'Executive', 'Simples Nacional', 'Simples Nacional', NULL, 'Pequena Empresa', 'Goiânia', 'Ativa', 'Educação', 'Educação', 4000.00, 'inadimplente', '2024-01-25', 'Igor Tavares', 'Elisa Medeiros', 'Renan Barbosa', 'Jaqueline Pires'),

-- Empresas inativas/sem movimento
('OldTech Ltda', '78.901.234/0001-57', NULL, 'Low', 'Executive', 'Simples Nacional', 'Simples Nacional', NULL, 'Pequena Empresa', 'Vitória', 'Sem Movimento', 'Tecnologia', 'Tecnologia', 1500.00, 'sem_debitos', NULL, 'Victor Hugo', 'Alessandra Lima', 'Fernando Cardoso', 'Mariana Silva'),
('Inactive Corp', '89.012.345/0001-68', NULL, 'Medium', 'Executive', 'Lucro Presumido', 'Lucro Presumido', NULL, 'Média Empresa', 'Natal', 'Sem Movimento', 'Comércio', 'Varejo', 3500.00, 'inadimplente', '2023-12-01', 'Gabriel Santos', 'Luciana Moreira', 'Claudio Oliveira', 'Silvia Almeida');

-- Inserir dados de relatórios financeiros mensais (2023 e 2024)
INSERT INTO public.monthly_financial_reports (year, month, total_revenue, total_companies, delinquent_companies, revenue_without_delinquents) VALUES
-- 2023
(2023, 1, 145000.00, 18, 3, 125000.00),
(2023, 2, 156000.00, 18, 4, 130000.00),
(2023, 3, 162000.00, 18, 2, 148000.00),
(2023, 4, 158000.00, 18, 3, 138000.00),
(2023, 5, 170000.00, 18, 2, 155000.00),
(2023, 6, 175000.00, 18, 4, 145000.00),
(2023, 7, 168000.00, 18, 3, 150000.00),
(2023, 8, 172000.00, 18, 2, 162000.00),
(2023, 9, 180000.00, 18, 3, 160000.00),
(2023, 10, 185000.00, 18, 4, 155000.00),
(2023, 11, 190000.00, 18, 2, 175000.00),
(2023, 12, 195000.00, 18, 3, 170000.00),
-- 2024
(2024, 1, 200000.00, 18, 5, 165000.00),
(2024, 2, 205000.00, 18, 6, 160000.00),
(2024, 3, 198000.00, 18, 7, 148000.00),
(2024, 4, 210000.00, 18, 5, 175000.00),
(2024, 5, 215000.00, 18, 4, 185000.00),
(2024, 6, 220000.00, 18, 6, 180000.00),
(2024, 7, 225000.00, 18, 5, 190000.00),
(2024, 8, 230000.00, 18, 7, 185000.00);

-- Inserir histórico de inadimplência detalhado
INSERT INTO public.delinquency_history (company_id, status, start_date, end_date, notes) 
SELECT 
    c.id,
    'inadimplente',
    c.delinquency_start_date,
    NULL,
    CASE 
        WHEN c.name LIKE '%InnovaSoft%' THEN 'Atraso devido a reestruturação interna'
        WHEN c.name LIKE '%CreditPlus%' THEN 'Problemas de fluxo de caixa temporários'
        WHEN c.name LIKE '%ShopCenter%' THEN 'Impacto da sazonalidade no varejo'
        WHEN c.name LIKE '%ManufacturingCorp%' THEN 'Dificuldades no setor industrial'
        WHEN c.name LIKE '%ConsultPlus%' THEN 'Renegociação de contratos em andamento'
        WHEN c.name LIKE '%MediCorp%' THEN 'Aguardando repasse de convênios médicos'
        WHEN c.name LIKE '%Learning Center%' THEN 'Redução de matrículas no período'
        ELSE 'Inadimplência registrada automaticamente'
    END
FROM public.companies c 
WHERE c.delinquency_status = 'inadimplente';

-- Inserir alguns históricos de inadimplência resolvida (empresas que já foram inadimplentes)
INSERT INTO public.delinquency_history (company_id, status, start_date, end_date, notes) 
SELECT 
    c.id,
    'inadimplente',
    c.created_at + INTERVAL '30 days',
    c.created_at + INTERVAL '75 days',
    'Inadimplência resolvida após renegociação'
FROM public.companies c 
WHERE c.delinquency_status = 'sem_debitos' 
AND c.name IN ('TechCorp Ltda', 'FinanceMax', 'IndustrialMax', 'ServicePro Ltda')
LIMIT 4;

-- Inserir registro de resolução para essas empresas
INSERT INTO public.delinquency_history (company_id, status, start_date, end_date, notes) 
SELECT 
    c.id,
    'sem_debitos',
    c.created_at + INTERVAL '75 days',
    NULL,
    'Situação regularizada'
FROM public.companies c 
WHERE c.delinquency_status = 'sem_debitos' 
AND c.name IN ('TechCorp Ltda', 'FinanceMax', 'IndustrialMax', 'ServicePro Ltda')
LIMIT 4;
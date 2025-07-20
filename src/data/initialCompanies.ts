
import { Company } from '../types/company';

export const initialCompanies: Company[] = [
  {
    id: '1',
    name: 'Tech Solutions Ltd',
    taxId: '12.345.678/0001-90',
    complexityLevel: 'High',
    clientClass: 'VIP',
    taxRegime: 'Lucro Real',
    newTaxRegime: 'LUCRO REAL',
    group: 'GRUPO SOARES',
    classification: 'AVANÇADO',
    municipality: 'IMPERATRIZ',
    situation: 'COM MOVIMENTO',
    honoraryValue: 2500.00,
    companySector: 'SERVIÇOS',
    segment: 'INFORMÁTICA',
    collaboratorIds: ['3'],
    sectorResponsibles: {
      fiscal: 'Gerente Fiscal',
      pessoal: 'Colaborador',
      contabil: 'Administrador'
    }
  },
  {
    id: '2',
    name: 'Marketing Pro',
    taxId: '98.765.432/0001-11',
    complexityLevel: 'Medium',
    clientClass: 'Executive',
    taxRegime: 'Simples Nacional',
    newTaxRegime: 'SIMPLES NACIONAL',
    group: 'GRUPO CARLOS ALBERTO',
    classification: 'ESSENCIAL',
    municipality: 'BARRA DO CORDA',
    situation: 'COM MOVIMENTO',
    honoraryValue: 1800.00,
    companySector: 'SERVIÇOS',
    segment: 'CONSULTORIA',
    collaboratorIds: ['3'],
    sectorResponsibles: {
      fiscal: 'Gerente Fiscal',
      pessoal: 'Colaborador',
      contabil: 'Administrador'
    }
  },
  {
    id: '3',
    name: 'Comércio Central Ltda',
    taxId: '11.222.333/0001-44',
    complexityLevel: 'Low',
    clientClass: 'Executive',
    taxRegime: 'Simples Nacional',
    newTaxRegime: 'SIMPLES NACIONAL',
    group: 'GRUPO BRUNA',
    classification: 'BÁSICO',
    municipality: 'GRAJAÚ',
    situation: 'COM MOVIMENTO',
    honoraryValue: 1200.00,
    companySector: 'COMÉRCIO',
    segment: 'SUPERMERCADO',
    collaboratorIds: ['2'],
    sectorResponsibles: {
      fiscal: 'Gerente Fiscal',
      contabil: 'Administrador'
    }
  },
  {
    id: '4',
    name: 'Construção & Cia',
    taxId: '55.666.777/0001-88',
    complexityLevel: 'High',
    clientClass: 'Diamond',
    taxRegime: 'Lucro Presumido',
    newTaxRegime: 'LUCRO PRESUMIDO',
    group: 'GRUPO FRANCO CONSTRUÇÕES',
    classification: 'MASTER',
    municipality: 'IMPERATRIZ',
    situation: 'COM MOVIMENTO',
    honoraryValue: 3500.00,
    companySector: 'CONSTRUÇÃO CIVIL',
    segment: 'MATERIAIS DE CONSTRUÇÃO',
    collaboratorIds: ['1', '2'],
    sectorResponsibles: {
      fiscal: 'Administrador',
      pessoal: 'Gerente Fiscal',
      contabil: 'Administrador'
    }
  },
  {
    id: '5',
    name: 'Agropecuária Verde',
    taxId: '99.888.777/0001-66',
    complexityLevel: 'Medium',
    clientClass: 'VIP',
    taxRegime: 'Lucro Presumido',
    newTaxRegime: 'LUCRO PRESUMIDO',
    group: 'GRUPO AGRICOLA GROENER',
    classification: 'AVANÇADO',
    municipality: 'AMARANTE DO MARANHÃO',
    situation: 'COM MOVIMENTO',
    honoraryValue: 2200.00,
    companySector: 'AGRONEGÓCIO',
    segment: 'PECUÁRIA',
    collaboratorIds: ['2', '3'],
    sectorResponsibles: {
      fiscal: 'Gerente Fiscal',
      pessoal: 'Colaborador',
      contabil: 'Administrador'
    }
  },
  {
    id: '6',
    name: 'Transportes Rápidos',
    taxId: '33.444.555/0001-22',
    complexityLevel: 'Medium',
    clientClass: 'Executive',
    taxRegime: 'Simples Nacional',
    newTaxRegime: 'SIMPLES NACIONAL',
    group: 'GRUPO TRUCKAUTO',
    classification: 'ESSENCIAL',
    municipality: 'BURITIRANA',
    situation: 'COM MOVIMENTO',
    honoraryValue: 1600.00,
    companySector: 'TRANSPORTE',
    segment: 'TRANSPORTADORA',
    collaboratorIds: ['3'],
    sectorResponsibles: {
      fiscal: 'Gerente Fiscal',
      contabil: 'Administrador'
    }
  }
];


import { Company } from '../types/company';

export const initialCompanies: Company[] = [
  {
    id: '1',
    name: 'Tech Solutions Ltd',
    taxId: '12.345.678/0001-90',
    complexityLevel: 'High',
    clientClass: 'VIP',
    taxRegime: 'Lucro Real',
    segment: 'INFORMÁTICA',
    collaboratorIds: ['3'],
    sectorResponsibles: {
      fiscal: '2',
      pessoal: '3',
      contabil: '2',
      financeiro: '2'
    },
    group: 'GRUPO SOARES',
    classification: 'AVANÇADO',
    municipality: 'IMPERATRIZ',
    newTaxRegime: 'LUCRO REAL',
    situation: 'COM MOVIMENTO',
    honoraryValue: 2500.00,
    companySector: 'SERVIÇOS'
  },
  {
    id: '2',
    name: 'Marketing Pro',
    taxId: '98.765.432/0001-11',
    complexityLevel: 'Medium',
    clientClass: 'Executive',
    taxRegime: 'Simples Nacional',
    segment: 'CONSULTORIA',
    collaboratorIds: ['3'],
    sectorResponsibles: {
      fiscal: '2',
      pessoal: '3',
      contabil: '2',
      financeiro: '2'
    },
    group: 'GRUPO CARLOS ALBERTO',
    classification: 'ESSENCIAL',
    municipality: 'BARRA DO CORDA',
    newTaxRegime: 'SIMPLES NACIONAL',
    situation: 'COM MOVIMENTO',
    honoraryValue: 1800.00,
    companySector: 'SERVIÇOS'
  },
  {
    id: '3',
    name: 'Financial Services',
    taxId: '11.222.333/0001-44',
    complexityLevel: 'Low',
    clientClass: 'Diamond',
    taxRegime: 'Lucro Presumido',
    segment: 'CORRETORA',
    collaboratorIds: [],
    sectorResponsibles: {
      fiscal: '2',
      contabil: '2',
      financeiro: '2'
    },
    group: 'GRUPO RAMOS',
    classification: 'MASTER',
    municipality: 'GRAJAÚ',
    newTaxRegime: 'LUCRO PRESUMIDO',
    situation: 'COM MOVIMENTO',
    honoraryValue: 3200.00,
    companySector: 'SERVIÇOS'
  },
  {
    id: '4',
    name: 'Indústria Metalúrgica',
    taxId: '44.555.666/0001-77',
    complexityLevel: 'High',
    clientClass: 'VIP',
    taxRegime: 'Lucro Real',
    segment: 'METALURGIA',
    collaboratorIds: ['3'],
    sectorResponsibles: {
      fiscal: '2',
      pessoal: '3',
      contabil: '2',
      financeiro: '2'
    },
    group: 'GRUPO INDUSTRIAL',
    classification: 'MASTER',
    municipality: 'IMPERATRIZ',
    newTaxRegime: 'LUCRO REAL',
    situation: 'COM MOVIMENTO',
    honoraryValue: 4500.00,
    companySector: 'INDÚSTRIA'
  },
  {
    id: '5',
    name: 'Comércio Varejista',
    taxId: '55.666.777/0001-88',
    complexityLevel: 'Medium',
    clientClass: 'Executive',
    taxRegime: 'Simples Nacional',
    segment: 'VAREJO',
    collaboratorIds: ['3'],
    sectorResponsibles: {
      fiscal: '2',
      pessoal: '3',
      contabil: '2',
      financeiro: '2'
    },
    group: 'GRUPO COMERCIAL',
    classification: 'ESSENCIAL',
    municipality: 'BARRA DO CORDA',
    newTaxRegime: 'SIMPLES NACIONAL',
    situation: 'COM MOVIMENTO',
    honoraryValue: 1200.00,
    companySector: 'COMÉRCIO'
  },
  {
    id: '6',
    name: 'Construção Civil Ltda',
    taxId: '66.777.888/0001-99',
    complexityLevel: 'High',
    clientClass: 'Diamond',
    taxRegime: 'Lucro Presumido',
    segment: 'CONSTRUÇÃO',
    collaboratorIds: ['3'],
    sectorResponsibles: {
      fiscal: '2',
      pessoal: '3',
      contabil: '2',
      financeiro: '2'
    },
    group: 'GRUPO CONSTRUÇÃO',
    classification: 'AVANÇADO',
    municipality: 'GRAJAÚ',
    newTaxRegime: 'LUCRO PRESUMIDO',
    situation: 'COM MOVIMENTO',
    honoraryValue: 3800.00,
    companySector: 'CONSTRUÇÃO'
  },
  {
    id: '7',
    name: 'Agropecuária Verde',
    taxId: '77.888.999/0001-11',
    complexityLevel: 'Medium',
    clientClass: 'Executive',
    taxRegime: 'Simples Nacional',
    segment: 'AGRICULTURA',
    collaboratorIds: ['3'],
    sectorResponsibles: {
      fiscal: '2',
      pessoal: '3',
      contabil: '2',
      financeiro: '2'
    },
    group: 'GRUPO AGRO',
    classification: 'ESSENCIAL',
    municipality: 'IMPERATRIZ',
    newTaxRegime: 'SIMPLES NACIONAL',
    situation: 'COM MOVIMENTO',
    honoraryValue: 2200.00,
    companySector: 'AGRICULTURA'
  },
  {
    id: '8',
    name: 'Transportes Rápidos',
    taxId: '88.999.000/0001-22',
    complexityLevel: 'Low',
    clientClass: 'VIP',
    taxRegime: 'Lucro Real',
    segment: 'TRANSPORTE',
    collaboratorIds: ['3'],
    sectorResponsibles: {
      fiscal: '2',
      pessoal: '3',
      contabil: '2',
      financeiro: '2'
    },
    group: 'GRUPO TRANSPORTE',
    classification: 'BÁSICO',
    municipality: 'BARRA DO CORDA',
    newTaxRegime: 'LUCRO REAL',
    situation: 'COM MOVIMENTO',
    honoraryValue: 2800.00,
    companySector: 'SERVIÇOS'
  }
];

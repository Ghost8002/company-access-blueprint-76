
export const getTaxRegimeColor = (regime?: string) => {
  switch (regime) {
    case 'SIMPLES NACIONAL': return 'bg-green-100 text-green-800';
    case 'LUCRO PRESUMIDO': return 'bg-yellow-100 text-yellow-800';
    case 'LUCRO REAL': return 'bg-red-100 text-red-800';
    case 'MEI': return 'bg-blue-100 text-blue-800';
    case 'PF': return 'bg-purple-100 text-purple-800';
    case 'TERCEIRO SETOR': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getSituationColor = (situation?: string) => {
  switch (situation) {
    case 'COM MOVIMENTO': return 'bg-green-100 text-green-800';
    case 'SEM MOVIMENTO': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getClassificationColor = (classification?: string) => {
  switch (classification) {
    case 'MASTER': return 'bg-purple-100 text-purple-800';
    case 'EXECULTIVO': return 'bg-blue-100 text-blue-800';
    case 'AVANÇADO': return 'bg-green-100 text-green-800';
    case 'ESSENCIAL': return 'bg-yellow-100 text-yellow-800';
    case 'BÁSICO': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getComplexityColor = (complexity?: string) => {
  switch (complexity) {
    case 'High': return 'bg-red-100 text-red-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getSectorColor = (sector?: string) => {
  switch (sector) {
    case 'COMÉRCIO': return 'bg-blue-100 text-blue-800';
    case 'INDÚSTRIA': return 'bg-purple-100 text-purple-800';
    case 'PRODUTOR RURAL': return 'bg-green-100 text-green-800';
    case 'SERVIÇOS': return 'bg-orange-100 text-orange-800';
    case 'TERCEIRO SETOR': return 'bg-pink-100 text-pink-800';
    case 'CONSTRUÇÃO CIVIL': return 'bg-amber-100 text-amber-800';
    case 'TECNOLOGIA': return 'bg-indigo-100 text-indigo-800';
    case 'SAÚDE': return 'bg-red-100 text-red-800';
    case 'EDUCAÇÃO': return 'bg-emerald-100 text-emerald-800';
    case 'TRANSPORTE': return 'bg-cyan-100 text-cyan-800';
    case 'AGRONEGÓCIO': return 'bg-lime-100 text-lime-800';
    case 'FINANCEIRO': return 'bg-teal-100 text-teal-800';
    case 'ENERGIA': return 'bg-yellow-100 text-yellow-800';
    case 'TELECOMUNICAÇÕES': return 'bg-violet-100 text-violet-800';
    case 'OUTROS': return 'bg-slate-100 text-slate-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

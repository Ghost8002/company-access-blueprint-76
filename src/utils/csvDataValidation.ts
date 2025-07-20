
import { fieldVariations, findFieldValue } from './csvFieldMapping';

export const validateRowData = (data: any[]): any[] => {
  if (!data || data.length === 0) {
    return [];
  }

  // Filtrar linhas válidas - APENAS NOME É OBRIGATÓRIO
  const validData = data.filter((item, index) => {
    const name = findFieldValue(item, fieldVariations.name);
    
    // Apenas o nome é obrigatório
    const isValid = name && name.trim() !== '';
    
    return isValid;
  });

  return validData;
};

export const extractBasicFields = (item: any) => {
  const name = findFieldValue(item, fieldVariations.name);
  const taxId = findFieldValue(item, fieldVariations.cnpj);
  const taxRegime = findFieldValue(item, fieldVariations.newTaxRegime) || 'Simples Nacional';
  
  return { name, taxId: taxId || '', taxRegime };
};

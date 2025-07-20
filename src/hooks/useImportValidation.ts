
import { Company, TaxRegime } from '../types/company';
import { ImportOptions, ImportResult } from '../types/importData';
import { validateRowData, extractBasicFields } from '../utils/csvDataValidation';
import { prepareCompanyData } from '../utils/csvFieldMapping';

export const useImportValidation = (
  companies: Company[], 
  addCompany: (company: Omit<Company, 'id'>) => void,
  updateCompany?: (id: string, updates: Partial<Company>) => void
) => {
  const validateAndImportData = async (
    data: any[], 
    options: ImportOptions = { updateExisting: false }
  ): Promise<ImportResult> => {
    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errors: string[] = [];

    const validData = validateRowData(data);

    if (validData.length === 0) {
      errors.push('Nenhuma linha válida encontrada. Verifique se o arquivo contém uma coluna com o nome da empresa (Empresas/Nome).');
      return { importedCount, updatedCount, skippedCount, errors };
    }

    for (const item of validData) {
      const originalIndex = data.indexOf(item) + 1;
      
      try {
        const { name, taxId, taxRegime } = extractBasicFields(item);
        
        // Validar apenas nome obrigatório
        if (!name || name.trim() === '') {
          const error = `Linha ${originalIndex}: Nome da empresa é obrigatório`;
          errors.push(error);
          continue;
        }

        // Verificar se a empresa já existe (por CNPJ se informado, senão por nome)
        let existingCompany;
        if (taxId) {
          existingCompany = companies.find(c => c.taxId === taxId);
        } else {
          existingCompany = companies.find(c => c.name.toLowerCase() === name.toLowerCase());
        }
        
        if (existingCompany) {
          if (options.updateExisting && updateCompany) {
            const updatedData = prepareCompanyData(item);
            await updateCompany(existingCompany.id, updatedData);
            updatedCount++;
          } else {
            skippedCount++;
          }
          continue;
        }

        // Criar nova empresa
        const newCompanyData = prepareCompanyData(item);
        const newCompany: Omit<Company, 'id'> = {
          name,
          taxId: taxId || '',
          taxRegime: (taxRegime as TaxRegime) || 'Simples Nacional',
          ...newCompanyData,
          collaboratorIds: [],
          sectorResponsibles: newCompanyData.sectorResponsibles || {},
          alerts: []
        };

        await addCompany(newCompany);
        importedCount++;
        
      } catch (error) {
        const errorMsg = `Linha ${originalIndex}: Erro ao processar dados - ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return { importedCount, updatedCount, skippedCount, errors };
  };

  return { validateAndImportData };
};

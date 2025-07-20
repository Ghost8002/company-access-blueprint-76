
import { useState, useMemo } from 'react';
import { Company } from '../../../../types/company';
import { FilterState } from '../TableFilters';
import { useAuth } from '../../../../contexts/AuthContext';

export const useTableFilters = (companies: Company[]) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    companyName: '',
    companySector: '',
    newTaxRegime: '',
    municipality: '',
    situation: '',
    complexityLevel: '',
    classification: '',
    segment: '',
    honoraryValueMin: '',
    honoraryValueMax: ''
  });

  const filteredCompanies = useMemo(() => {
    let companiesToFilter = companies;
    
    // Apenas colaboradores têm filtro de empresas por responsabilidade
    if (user?.role === 'collaborator' && user.sector) {
      companiesToFilter = companies.filter(company => {
        const sectorResponsibles = company.sectorResponsibles;
        if (!sectorResponsibles) return false;
        
        const responsibleForSector = sectorResponsibles[user.sector as keyof typeof sectorResponsibles];
        return responsibleForSector === user.id;
      });
    }
    
    return companiesToFilter.filter(company => {
      // Filtro de busca por nome
      if (filters.search && !company.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Filtro por nome da empresa
      if (filters.companyName && !company.name.toLowerCase().includes(filters.companyName.toLowerCase())) {
        return false;
      }

      // Filtro por setor
      if (filters.companySector && filters.companySector !== 'all' && company.companySector !== filters.companySector) {
        return false;
      }

      // Filtro por regime tributário
      if (filters.newTaxRegime && filters.newTaxRegime !== 'all' && company.newTaxRegime !== filters.newTaxRegime) {
        return false;
      }

      // Filtro por município
      if (filters.municipality && filters.municipality !== 'all' && company.municipality !== filters.municipality) {
        return false;
      }

      // Filtro por situação
      if (filters.situation && filters.situation !== 'all' && company.situation !== filters.situation) {
        return false;
      }

      // Filtro por nível de complexidade
      if (filters.complexityLevel && filters.complexityLevel !== 'all' && company.complexityLevel !== filters.complexityLevel) {
        return false;
      }

      // Filtro por classificação
      if (filters.classification && filters.classification !== 'all' && company.classification !== filters.classification) {
        return false;
      }

      // Filtro por segmento
      if (filters.segment && filters.segment !== 'all' && company.segment !== filters.segment) {
        return false;
      }
      // Filtro por valor de honorário mínimo
      if (filters.honoraryValueMin && company.honoraryValue !== undefined && company.honoraryValue < Number(filters.honoraryValueMin)) {
        return false;
      }
      // Filtro por valor de honorário máximo
      if (filters.honoraryValueMax && company.honoraryValue !== undefined && company.honoraryValue > Number(filters.honoraryValueMax)) {
        return false;
      }

      return true;
    });
  }, [companies, filters, user]);

  return {
    filters,
    setFilters,
    filteredCompanies
  };
};

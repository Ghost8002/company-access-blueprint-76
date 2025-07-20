
import { useState } from 'react';
import { Company } from '../types/company';
import { initialCompanies } from '../data/initialCompanies';

export const useCompanyActions = () => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  const addCompany = (newCompany: Omit<Company, 'id'>) => {
    const id = Date.now().toString();
    setCompanies(prev => [...prev, { ...newCompany, id }]);
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  const getCompaniesByCollaborator = (collaboratorId: string) => {
    return companies.filter(c => c.collaboratorIds.includes(collaboratorId));
  };

  return {
    companies,
    setCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompaniesByCollaborator
  };
};

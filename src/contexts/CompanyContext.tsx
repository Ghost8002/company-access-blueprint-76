
import React, { createContext, useContext, ReactNode } from 'react';
import { Company } from '../types/company';
import { useCompanyActions } from '../hooks/useCompanyActions';

interface CompanyContextType {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  getCompaniesByCollaborator: (collaboratorId: string) => Company[];
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompanies = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanies must be used within CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const {
    companies,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompaniesByCollaborator
  } = useCompanyActions();

  return (
    <CompanyContext.Provider value={{
      companies,
      addCompany,
      updateCompany,
      deleteCompany,
      getCompaniesByCollaborator
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

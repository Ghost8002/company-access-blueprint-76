
import React, { createContext, useContext, ReactNode } from 'react';
import { Company } from '../types/company';
import { useSupabaseCompanies } from '../hooks/useSupabaseCompanies';

interface CompanyContextType {
  companies: Company[];
  loading: boolean;
  error: string | null;
  addCompany: (company: Omit<Company, 'id'>) => Promise<void>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  getCompaniesByCollaborator: (collaboratorId: string) => Company[];
  refetch: () => Promise<void>;
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
    loading,
    error,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompaniesByCollaborator,
    refetch
  } = useSupabaseCompanies();

  return (
    <CompanyContext.Provider value={{
      companies,
      loading,
      error,
      addCompany,
      updateCompany,
      deleteCompany,
      getCompaniesByCollaborator,
      refetch
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

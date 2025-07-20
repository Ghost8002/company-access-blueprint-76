
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company, ComplexityLevel, ClientClass, TaxRegime, NewTaxRegime, CompanyGroup, CompanyClassification, CompanyMunicipality, CompanySituation, CompanySector, CompanySegment } from '../types/company';
import type { Database } from '@/integrations/supabase/types';

type CompanyRow = Database['public']['Tables']['companies']['Row'];
type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
type CompanyUpdate = Database['public']['Tables']['companies']['Update'];

export const useSupabaseCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      console.log('Fetching companies from Supabase...');
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }

      console.log('Companies fetched successfully:', data?.length || 0);

      const mappedCompanies: Company[] = (data || []).map((company: CompanyRow) => ({
        id: company.id,
        name: company.name,
        taxId: company.tax_id || '',
        cpf: company.cpf || '',
        complexityLevel: company.complexity_level as ComplexityLevel || undefined,
        clientClass: company.client_class as ClientClass || undefined,
        taxRegime: (company.tax_regime || 'Simples Nacional') as TaxRegime,
        newTaxRegime: company.new_tax_regime as NewTaxRegime || undefined,
        group: company.company_group as CompanyGroup || undefined,
        classification: company.classification as CompanyClassification || undefined,
        municipality: company.municipality as CompanyMunicipality || undefined,
        situation: company.situation as CompanySituation || undefined,
        honoraryValue: company.honorary_value || 0,
        companySector: company.company_sector as CompanySector || undefined,
        segment: company.segment as CompanySegment || undefined,
        collaboratorIds: [], // Will be populated by junction table
        sectorResponsibles: {
          fiscal: company.fiscal_responsible || undefined,
          pessoal: company.pessoal_responsible || undefined,
          contabil: company.contabil_responsible || undefined,
          financeiro: company.financeiro_responsible || undefined
        },
        alerts: company.alerts || []
      }));

      setCompanies(mappedCompanies);
      setError(null);
    } catch (err) {
      console.error('Error in fetchCompanies:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (newCompany: Omit<Company, 'id'>) => {
    try {
      console.log('Adding new company:', newCompany.name);
      
      const insertData: CompanyInsert = {
        name: newCompany.name,
        tax_id: newCompany.taxId || null,
        cpf: newCompany.cpf || null,
        complexity_level: newCompany.complexityLevel || null,
        client_class: newCompany.clientClass || null,
        tax_regime: newCompany.taxRegime || 'Simples Nacional',
        new_tax_regime: newCompany.newTaxRegime || null,
        company_group: newCompany.group || null,
        classification: newCompany.classification || null,
        municipality: newCompany.municipality || null,
        situation: newCompany.situation || null,
        honorary_value: newCompany.honoraryValue || null,
        company_sector: newCompany.companySector || null,
        segment: newCompany.segment || null,
        fiscal_responsible: newCompany.sectorResponsibles?.fiscal || null,
        pessoal_responsible: newCompany.sectorResponsibles?.pessoal || null,
        contabil_responsible: newCompany.sectorResponsibles?.contabil || null,
        financeiro_responsible: newCompany.sectorResponsibles?.financeiro || null,
        alerts: newCompany.alerts || null
      };

      const { data, error } = await supabase
        .from('companies')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error adding company:', error);
        throw error;
      }

      console.log('Company added successfully:', data);
      await fetchCompanies(); // Refresh the list
    } catch (err) {
      console.error('Error in addCompany:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar empresa');
      throw err;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      console.log('Updating company:', id, updates);
      
      const updateData: CompanyUpdate = {
        name: updates.name,
        tax_id: updates.taxId || null,
        cpf: updates.cpf || null,
        complexity_level: updates.complexityLevel || null,
        client_class: updates.clientClass || null,
        tax_regime: updates.taxRegime,
        new_tax_regime: updates.newTaxRegime || null,
        company_group: updates.group || null,
        classification: updates.classification || null,
        municipality: updates.municipality || null,
        situation: updates.situation || null,
        honorary_value: updates.honoraryValue || null,
        company_sector: updates.companySector || null,
        segment: updates.segment || null,
        fiscal_responsible: updates.sectorResponsibles?.fiscal || null,
        pessoal_responsible: updates.sectorResponsibles?.pessoal || null,
        contabil_responsible: updates.sectorResponsibles?.contabil || null,
        financeiro_responsible: updates.sectorResponsibles?.financeiro || null,
        alerts: updates.alerts || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating company:', error);
        throw error;
      }

      console.log('Company updated successfully');
      await fetchCompanies(); // Refresh the list
    } catch (err) {
      console.error('Error in updateCompany:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar empresa');
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      console.log('Deleting company:', id);
      
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting company:', error);
        throw error;
      }

      console.log('Company deleted successfully');
      await fetchCompanies(); // Refresh the list
    } catch (err) {
      console.error('Error in deleteCompany:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar empresa');
      throw err;
    }
  };

  const getCompaniesByCollaborator = (collaboratorId: string) => {
    // This would need to be implemented with a proper join query
    return companies.filter(c => c.collaboratorIds.includes(collaboratorId));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    loading,
    error,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompaniesByCollaborator,
    refetch: fetchCompanies
  };
};

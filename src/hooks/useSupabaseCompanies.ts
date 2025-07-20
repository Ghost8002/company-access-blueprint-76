
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '../types/company';

export const useSupabaseCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*');

      if (error) throw error;

      const mappedCompanies: Company[] = (data || []).map(company => ({
        id: company.id,
        name: company.name,
        taxId: company.tax_id || '',
        cpf: company.cpf,
        complexityLevel: company.complexity_level,
        clientClass: company.client_class,
        taxRegime: company.tax_regime || 'Simples Nacional',
        newTaxRegime: company.new_tax_regime,
        group: company.company_group,
        classification: company.classification,
        municipality: company.municipality,
        situation: company.situation,
        honoraryValue: company.honorary_value,
        companySector: company.company_sector,
        segment: company.segment,
        collaboratorIds: [], // Will be populated by junction table
        sectorResponsibles: {
          fiscal: company.fiscal_responsible,
          pessoal: company.pessoal_responsible,
          contabil: company.contabil_responsible,
          financeiro: company.financeiro_responsible
        },
        alerts: company.alerts || []
      }));

      setCompanies(mappedCompanies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (newCompany: Omit<Company, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: newCompany.name,
          tax_id: newCompany.taxId,
          cpf: newCompany.cpf,
          complexity_level: newCompany.complexityLevel,
          client_class: newCompany.clientClass,
          tax_regime: newCompany.taxRegime,
          new_tax_regime: newCompany.newTaxRegime,
          company_group: newCompany.group,
          classification: newCompany.classification,
          municipality: newCompany.municipality,
          situation: newCompany.situation,
          honorary_value: newCompany.honoraryValue,
          company_sector: newCompany.companySector,
          segment: newCompany.segment,
          fiscal_responsible: newCompany.sectorResponsibles?.fiscal,
          pessoal_responsible: newCompany.sectorResponsibles?.pessoal,
          contabil_responsible: newCompany.sectorResponsibles?.contabil,
          financeiro_responsible: newCompany.sectorResponsibles?.financeiro,
          alerts: newCompany.alerts
        })
        .select()
        .single();

      if (error) throw error;

      await fetchCompanies(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar empresa');
      throw err;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: updates.name,
          tax_id: updates.taxId,
          cpf: updates.cpf,
          complexity_level: updates.complexityLevel,
          client_class: updates.clientClass,
          tax_regime: updates.taxRegime,
          new_tax_regime: updates.newTaxRegime,
          company_group: updates.group,
          classification: updates.classification,
          municipality: updates.municipality,
          situation: updates.situation,
          honorary_value: updates.honoraryValue,
          company_sector: updates.companySector,
          segment: updates.segment,
          fiscal_responsible: updates.sectorResponsibles?.fiscal,
          pessoal_responsible: updates.sectorResponsibles?.pessoal,
          contabil_responsible: updates.sectorResponsibles?.contabil,
          financeiro_responsible: updates.sectorResponsibles?.financeiro,
          alerts: updates.alerts
        })
        .eq('id', id);

      if (error) throw error;

      await fetchCompanies(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar empresa');
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCompanies(); // Refresh the list
    } catch (err) {
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

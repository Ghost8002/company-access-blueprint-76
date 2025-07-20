
import { useState } from 'react';
import { Company } from '../../../../types/company';
import { useCompanies } from '../../../../contexts/CompanyContext';

export const useTableEdit = () => {
  const { updateCompany } = useCompanies();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Company>>({});

  const handleEdit = (company: Company) => {
    console.log('Iniciando edição da empresa:', company);
    setEditingId(company.id);
    setEditData({ ...company });
  };

  const handleSave = () => {
    console.log('Salvando dados:', { editingId, editData });
    if (editingId && editData) {
      updateCompany(editingId, editData);
      setEditingId(null);
      setEditData({});
      console.log('Dados salvos com sucesso');
    }
  };

  const handleCancel = () => {
    console.log('Cancelando edição');
    setEditingId(null);
    setEditData({});
  };

  return {
    editingId,
    editData,
    setEditData,
    handleEdit,
    handleSave,
    handleCancel
  };
};

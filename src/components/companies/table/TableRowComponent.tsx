
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Company } from '../../../types/company';
import { Column } from './utils/columnConfig';
import { CellRenderer } from './CellRenderer';
import { EditActions } from './EditActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import { useCompanies } from '../../../contexts/CompanyContext';

interface TableRowComponentProps {
  company: Company;
  columns: Column[];
  canEdit: boolean;
  editingId: string | null;
  editData: Partial<Company>;
  setEditData: (data: Partial<Company>) => void;
  onEdit: (company: Company) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

export const TableRowComponent = ({
  company,
  columns,
  canEdit,
  editingId,
  editData,
  setEditData,
  onEdit,
  onSave,
  onCancel,
  onDelete
}: TableRowComponentProps) => {
  const isEditing = editingId === company.id;
  const [showAlerts, setShowAlerts] = useState(false);
  const [newAlert, setNewAlert] = useState('');
  const { updateCompany } = useCompanies();

  const handleShowAlerts = () => setShowAlerts(true);
  const handleCloseAlerts = () => setShowAlerts(false);

  const handleAddAlert = () => {
    if (newAlert.trim() === '') return;
    const updatedAlerts = [...(company.alerts || []), newAlert.trim()];
    updateCompany(company.id, { alerts: updatedAlerts });
    setNewAlert('');
  };

  const handleRemoveAlert = (idx: number) => {
    const updatedAlerts = (company.alerts || []).filter((_, i) => i !== idx);
    updateCompany(company.id, { alerts: updatedAlerts });
  };

  return (
    <>
      <TableRow 
        className="hover:bg-gray-50 border-b border-gray-100"
        onDoubleClick={() => canEdit && onEdit(company)}
      >
        {columns.map((column) => (
          <TableCell
            key={`${company.id}-${column.key}`}
            className="p-2 border-r border-gray-100 last:border-r-0"
            style={{ width: column.width, minWidth: column.width }}
          >
            <CellRenderer
              company={company}
              column={column}
              isEditing={isEditing}
              editData={editData}
              setEditData={setEditData}
              onShowAlerts={column.key === 'name' ? handleShowAlerts : undefined}
            />
          </TableCell>
        ))}
        {canEdit && (
          <TableCell className="p-2 text-center">
            <EditActions
              company={company}
              editingId={editingId}
              onEdit={onEdit}
              onSave={onSave}
              onCancel={onCancel}
              onDelete={onDelete}
            />
          </TableCell>
        )}
      </TableRow>
      <Dialog open={showAlerts} onOpenChange={setShowAlerts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alertas da Empresa</DialogTitle>
            <DialogDescription>
              Gerencie os alertas e problemas relacionados à empresa {company.name}.
            </DialogDescription>
          </DialogHeader>
          {company.alerts && company.alerts.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {company.alerts.map((alert, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{alert}</span>
                  <button
                    className="ml-2 text-red-500 hover:underline text-xs"
                    onClick={() => handleRemoveAlert(idx)}
                  >Remover</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum alerta cadastrado para esta empresa.</p>
          )}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Descreva um novo problema/alerta..."
              value={newAlert}
              onChange={e => setNewAlert(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddAlert(); }}
            />
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              onClick={handleAddAlert}
            >Adicionar</button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';
import { Company } from '../../types/company';
import { useExcelExport } from '../../hooks/useExcelExport';

interface ExportSectionProps {
  companies: Company[];
}

export const ExportSection = ({ companies }: ExportSectionProps) => {
  const { exportToExcel, isExporting } = useExcelExport();

  const handleExportExcel = () => {
    exportToExcel(companies, 'empresas');
  };

  return (
    <Card className="macos-card macos-spring-hover">
      <CardHeader>
        <CardTitle className="macos-text-primary">Exportar Dados</CardTitle>
        <CardDescription className="macos-text-secondary">
          Faça o download dos dados das empresas cadastradas no sistema em formato Excel (XLSX).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg macos-glass macos-spring-hover macos-spring-tap">
          <div>
            <h4 className="font-medium macos-text-primary">Exportar todas as empresas</h4>
            <p className="text-sm macos-text-secondary">
              Baixar dados de {companies.length} empresas cadastradas em Excel
            </p>
          </div>
          <Button 
            onClick={handleExportExcel} 
            disabled={companies.length === 0 || isExporting}
            className="macos-button-interactive macos-spring-hover macos-spring-tap"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isExporting ? 'Exportando...' : 'Exportar Excel'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

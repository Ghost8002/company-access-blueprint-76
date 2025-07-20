import React from 'react';
import { useCompanies } from '../../contexts/CompanyContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Building2 } from 'lucide-react';

export const AlertsManagement = () => {
  const { companies } = useCompanies();
  const { user } = useAuth();

  // Filtrar empresas que têm alertas
  const companiesWithAlerts = companies.filter(company => 
    company.alerts && company.alerts.length > 0
  );

  // Se não há alertas, mostrar mensagem
  if (companiesWithAlerts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum alerta encontrado</h3>
          <p className="text-gray-500">Não há problemas cadastrados para nenhuma empresa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-8 h-8 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Alertas</h1>
          <p className="text-gray-600">Visualize e gerencie problemas das empresas</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {companiesWithAlerts.length} empresa{companiesWithAlerts.length !== 1 ? 's' : ''} com alertas
        </Badge>
      </div>

      <div className="grid gap-4">
        {companiesWithAlerts.map((company) => (
          <Card key={company.id} className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-600" />
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                </div>
                <Badge variant="destructive">
                  {company.alerts?.length} alerta{company.alerts?.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                CNPJ: {company.taxId} • Setor: {company.companySector || 'Não informado'}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {company.alerts?.map((alert, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                  >
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{alert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 

import React, { useState } from 'react';
import { useCompanies } from '../../contexts/CompanyContext';
import { MacOSCardAnimated } from '@/components/ui/macos-card-animated';
import { MacOSButtonAnimated } from '@/components/ui/macos-button-animated';
import { MacOSFade, MacOSStagger } from '@/components/ui/macos-animations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, DollarSign, TrendingUp, Building2, BarChart3, Calculator, Award, AlertTriangle, Shield } from 'lucide-react';
import { useExcelExport } from '../../hooks/useExcelExport';
import { HonoraryValueChart } from './charts/HonoraryValueChart';
import { MonthlyRevenueChart } from './charts/MonthlyRevenueChart';
import { CompanyValueTable } from './CompanyValueTable';
import { SectorSegmentAnalysisChart } from './charts/SectorSegmentAnalysisChart';
import { AdvancedAnalyticsChart } from './charts/AdvancedAnalyticsChart';
import { formatCurrency } from '../../utils/formatters';

interface ExportData {
  'Nome da Empresa': string;
  'CNPJ': string;
  'Valor Honorário': number | string;
  'Grupo': string;
  'Classificação': string;
  'Regime Tributário': string;
  'Município': string;
  'Situação': string;
}

export const FinancialReports = () => {
  const { companies } = useCompanies();
  const { exportToExcel, isExporting } = useExcelExport();
  const [activeTab, setActiveTab] = useState('rankings');
  const [selectedSectorForTable, setSelectedSectorForTable] = useState<string>('all');

  // Calcular métricas financeiras
  const companiesWithValue = companies.filter(c => c.honoraryValue && c.honoraryValue > 0);
  const totalRevenue = companiesWithValue.reduce((sum, c) => sum + (c.honoraryValue || 0), 0);
  const averageValue = totalRevenue / (companiesWithValue.length || 1);
  const highestValue = Math.max(...companiesWithValue.map(c => c.honoraryValue || 0));

  // Filtrar empresas por setor selecionado para a tabela
  const filteredCompaniesForTable = selectedSectorForTable === 'all' 
    ? companiesWithValue 
    : companiesWithValue.filter(c => c.companySector === selectedSectorForTable);

  const handleExportFinancialReport = () => {
    const exportData: ExportData[] = filteredCompaniesForTable.map(company => ({
      'Nome da Empresa': company.name,
      'CNPJ': company.taxId,
      'Valor Honorário': company.honoraryValue || 0,
      'Grupo': company.group || 'Sem grupo',
      'Classificação': company.classification || 'Não informado',
      'Regime Tributário': company.newTaxRegime || company.taxRegime,
      'Município': company.municipality || 'Não informado',
      'Situação': company.situation || 'Não informado'
    }));

    // Adicionar linha de totais
    const totalFilteredRevenue = filteredCompaniesForTable.reduce((sum, c) => sum + (c.honoraryValue || 0), 0);
    exportData.push({
      'Nome da Empresa': selectedSectorForTable === 'all' ? 'TOTAL GERAL' : `TOTAL ${selectedSectorForTable}`,
      'CNPJ': '-',
      'Valor Honorário': totalFilteredRevenue,
      'Grupo': '-',
      'Classificação': '-',
      'Regime Tributário': '-',
      'Município': '-',
      'Situação': '-'
    });

    const filename = selectedSectorForTable === 'all' ? 'relatorio-financeiro' : `relatorio-${selectedSectorForTable.toLowerCase()}`;
    exportToExcel(exportData, filename);
  };

  return (
    <MacOSFade>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <MacOSFade delay={100}>
            <div>
              <h2 className="text-3xl font-bold macos-text-primary">Relatórios Financeiros</h2>
              <p className="macos-text-secondary">Análise detalhada dos honorários e receitas</p>
            </div>
          </MacOSFade>
          <MacOSFade delay={200}>
            <MacOSButtonAnimated
              onClick={handleExportFinancialReport}
              disabled={isExporting}
              macosStyle
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exportando...' : 'Exportar Excel'}</span>
            </MacOSButtonAnimated>
          </MacOSFade>
        </div>

        {/* Tabs com Relatórios */}
        <MacOSFade delay={300}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="macos-glass backdrop-blur-xl border border-macos-border">
              <TabsTrigger value="overview" className="macos-tab">Visão Geral</TabsTrigger>
              <TabsTrigger value="rankings" className="macos-tab">Rankings</TabsTrigger>
              <TabsTrigger value="table" className="macos-tab">Tabela Detalhada</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Métricas Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MacOSFade delay={400}>
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">Receita Total</p>
                          <p className="text-2xl font-bold text-blue-800">
                            {formatCurrency(totalRevenue)}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            {companiesWithValue.length} empresas ativas
                          </p>
                        </div>
                        <DollarSign className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </MacOSFade>

                <MacOSFade delay={500}>
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">Ticket Médio</p>
                          <p className="text-2xl font-bold text-green-800">
                            {formatCurrency(averageValue)}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Valor por empresa
                          </p>
                        </div>
                        <Calculator className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </MacOSFade>

                <MacOSFade delay={600}>
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">Maior Cliente</p>
                          <p className="text-2xl font-bold text-purple-800">
                            {formatCurrency(highestValue)}
                          </p>
                          <p className="text-xs text-purple-600 mt-1">
                            Valor individual
                          </p>
                        </div>
                        <Award className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </MacOSFade>

                <MacOSFade delay={700}>
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-600">Concentração</p>
                          <p className="text-2xl font-bold text-orange-800">
                            {((highestValue / totalRevenue) * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-orange-600 mt-1">
                            Maior cliente
                          </p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </MacOSFade>
              </div>

              {/* Gráficos Principais */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MacOSFade delay={800}>
                  <HonoraryValueChart companies={companiesWithValue} />
                </MacOSFade>
                <MacOSFade delay={900}>
                  <MonthlyRevenueChart companies={companiesWithValue} />
                </MacOSFade>
              </div>

              {/* Análise de Regime Tributário */}
              <MacOSFade delay={1000}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      Distribuição por Regime Tributário
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(() => {
                        const regimeAnalysis = companiesWithValue.reduce((acc, company) => {
                          const regime = company.newTaxRegime || company.taxRegime || 'Não informado';
                          if (!acc[regime]) {
                            acc[regime] = { count: 0, totalValue: 0 };
                          }
                          acc[regime].count += 1;
                          acc[regime].totalValue += company.honoraryValue || 0;
                          return acc;
                        }, {} as Record<string, { count: number; totalValue: number }>);

                        return Object.entries(regimeAnalysis).map(([regime, data]) => (
                          <div key={regime} className="text-center p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">{regime}</h4>
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(data.totalValue)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {data.count} empresa{data.count > 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              {((data.totalValue / totalRevenue) * 100).toFixed(1)}% da receita
                            </p>
                          </div>
                        ));
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </MacOSFade>

              {/* Indicadores de Saúde Financeira */}
              <MacOSFade delay={1100}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Indicadores de Saúde Financeira
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">Diversificação</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {companiesWithValue.length > 10 ? 'Excelente' : 
                           companiesWithValue.length > 5 ? 'Boa' : 'Baixa'}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          {companiesWithValue.length} clientes
                        </p>
                      </div>

                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Risco de Concentração</h4>
                        <p className="text-2xl font-bold text-blue-600">
                          {((highestValue / totalRevenue) * 100) > 30 ? 'Alto' : 
                           ((highestValue / totalRevenue) * 100) > 15 ? 'Médio' : 'Baixo'}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          {((highestValue / totalRevenue) * 100).toFixed(1)}% maior cliente
                        </p>
                      </div>

                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2">Ticket Médio</h4>
                        <p className="text-2xl font-bold text-purple-600">
                          {averageValue > 50000 ? 'Alto' : 
                           averageValue > 20000 ? 'Médio' : 'Baixo'}
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          {formatCurrency(averageValue)}
                        </p>
                      </div>

                      <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-2">Projeção 12m</h4>
                        <p className="text-2xl font-bold text-orange-600">
                          {formatCurrency(totalRevenue * 1.15)}
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          +15% crescimento esperado
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </MacOSFade>
            </TabsContent>

            <TabsContent value="rankings" className="space-y-6">
              <MacOSFade delay={200}>
                {/* Análises Avançadas e Criativas */}
                <AdvancedAnalyticsChart companies={companiesWithValue} />
              </MacOSFade>
            </TabsContent>

            <TabsContent value="table" className="space-y-6">
              <MacOSFade delay={400}>
                {/* Gráfico para filtrar a tabela */}
                <div className="mb-6">
                  <SectorSegmentAnalysisChart 
                    companies={companiesWithValue} 
                    onSectorSelect={setSelectedSectorForTable}
                    selectedSector={selectedSectorForTable}
                  />
                </div>
                
                {/* Tabela filtrada */}
                <CompanyValueTable companies={filteredCompaniesForTable} />
              </MacOSFade>
            </TabsContent>
          </Tabs>
        </MacOSFade>
      </div>
    </MacOSFade>
  );
};

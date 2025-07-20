import React, { useState } from 'react';
import { Company } from '../../../types/company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, PieChart as PieChartIcon, Target } from 'lucide-react';

interface SectorSegmentAnalysisChartProps {
  companies: Company[];
  onSectorSelect?: (sector: string) => void;
  selectedSector?: string;
}

export const SectorSegmentAnalysisChart = ({ 
  companies, 
  onSectorSelect, 
  selectedSector: externalSelectedSector 
}: SectorSegmentAnalysisChartProps) => {
  const [selectedSector, setSelectedSector] = useState<string>(externalSelectedSector || 'all');
  const [viewMode, setViewMode] = useState<'sectors' | 'segments'>('sectors');
  const [analysisType, setAnalysisType] = useState<'revenue' | 'profitability' | 'efficiency'>('revenue');

  // Sincronizar com prop externa se fornecida
  React.useEffect(() => {
    if (externalSelectedSector !== undefined) {
      setSelectedSector(externalSelectedSector);
    }
  }, [externalSelectedSector]);

  // Filtrar empresas com valor honorário
  const companiesWithValue = companies.filter(c => c.honoraryValue && c.honoraryValue > 0);
  const totalRevenue = companiesWithValue.reduce((sum, c) => sum + (c.honoraryValue || 0), 0);

  // Processar dados por setor com análises contábeis
  const sectorData = companiesWithValue.reduce((acc, company) => {
    const sector = company.companySector || 'Não informado';
    const segment = company.segment || 'Não informado';
    const honoraryValue = company.honoraryValue || 0;

    if (!acc[sector]) {
      acc[sector] = {
        name: sector,
        totalValue: 0,
        totalCount: 0,
        segments: {},
        averageValue: 0,
        revenueShare: 0,
        profitability: 0 // Simulado - seria calculado com custos reais
      };
    }

    if (!acc[sector].segments[segment]) {
      acc[sector].segments[segment] = {
        name: segment,
        value: 0,
        count: 0,
        averageValue: 0,
        revenueShare: 0,
        sectorShare: 0
      };
    }

    acc[sector].totalValue += honoraryValue;
    acc[sector].totalCount += 1;
    acc[sector].segments[segment].value += honoraryValue;
    acc[sector].segments[segment].count += 1;

    return acc;
  }, {} as Record<string, any>);

  // Calcular métricas contábeis
  Object.values(sectorData).forEach((sector: any) => {
    sector.averageValue = sector.totalCount > 0 ? sector.totalValue / sector.totalCount : 0;
    sector.revenueShare = (sector.totalValue / totalRevenue) * 100;
    sector.profitability = sector.revenueShare * 0.85; // Simulado - margem de 85%

    Object.values(sector.segments).forEach((segment: any) => {
      segment.averageValue = segment.count > 0 ? segment.value / segment.count : 0;
      segment.revenueShare = (segment.value / totalRevenue) * 100;
      segment.sectorShare = (segment.value / sector.totalValue) * 100;
    });
  });

  // Converter para arrays com análises contábeis
  const sectorsArray = Object.values(sectorData).map((sector: any) => ({
    name: sector.name,
    value: sector.totalValue,
    count: sector.totalCount,
    percentage: sector.revenueShare.toFixed(1),
    averageValue: sector.averageValue,
    revenueShare: sector.revenueShare,
    profitability: sector.profitability,
    efficiency: sector.averageValue * sector.totalCount / totalRevenue * 100 // Eficiência por cliente
  }));

  // Dados para o gráfico atual
  const chartData = viewMode === 'sectors' 
    ? sectorsArray
    : selectedSector !== 'all' && sectorData[selectedSector]
      ? Object.values(sectorData[selectedSector].segments).map((segment: any) => ({
          name: segment.name,
          value: segment.value,
          count: segment.count,
          percentage: segment.revenueShare.toFixed(1),
          averageValue: segment.averageValue,
          revenueShare: segment.revenueShare,
          sectorShare: segment.sectorShare
        }))
      : [];



  // Cores para o gráfico
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg text-sm">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-green-600">R$ {data.value.toLocaleString('pt-BR')}</p>
          <p className="text-blue-600">{data.percentage}% do total</p>
        </div>
      );
    }
    return null;
  };

  const handleSectorClick = (sectorName: string) => {
    if (viewMode === 'sectors') {
      setSelectedSector(sectorName);
      setViewMode('segments');
      
      if (onSectorSelect) {
        onSectorSelect(sectorName);
      }
    }
  };

  const handleBackToSectors = () => {
    setViewMode('sectors');
    setSelectedSector('all');
    
    if (onSectorSelect) {
      onSectorSelect('all');
    }
  };

  const handleSectorFilterChange = (sector: string) => {
    setSelectedSector(sector);
    
    if (onSectorSelect) {
      onSectorSelect(sector);
    }
  };

  const selectedSectorData = selectedSector !== 'all' ? sectorData[selectedSector] : null;

  // Verificar se há dados
  if (companiesWithValue.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Análise Contábil por Setor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Nenhuma empresa com valor honorário encontrada.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Análise Principal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {viewMode === 'segments' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToSectors}
                  className="p-1 h-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <BarChart3 className="w-5 h-5" />
              {viewMode === 'sectors' ? 'Análise Contábil por Setor' : `Segmentos - ${selectedSector}`}
              {onSectorSelect && (
                <Badge variant="outline" className="text-xs ml-2">
                  Filtro Ativo
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                R$ {totalRevenue.toLocaleString('pt-BR')}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {companiesWithValue.length} Empresas
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Controles */}
            {viewMode === 'sectors' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filtrar por setor:</span>
                <Select value={selectedSector} onValueChange={handleSectorFilterChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Todos os setores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os setores</SelectItem>
                    {sectorsArray.map(sector => (
                      <SelectItem key={sector.name} value={sector.name}>
                        {sector.name} ({sector.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Gráficos lado a lado */}
            {chartData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico em Pizza */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onClick={(data) => viewMode === 'sectors' && handleSectorClick(data.name)}
                        style={{ cursor: viewMode === 'sectors' ? 'pointer' : 'default' }}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico em Barras */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        fontSize={10}
                      />
                      <YAxis 
                        orientation="left" 
                        stroke="#3B82F6"
                        fontSize={10}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="value" 
                        fill="#3B82F6" 
                        name="Valor Total (R$)"
                        onClick={(data) => viewMode === 'sectors' && handleSectorClick(data.name)}
                        style={{ cursor: viewMode === 'sectors' ? 'pointer' : 'default' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Resumo do setor selecionado */}
            {viewMode === 'segments' && selectedSectorData && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-sm text-blue-800 mb-2">
                  Resumo Contábil do Setor: {selectedSector}
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total de Empresas:</span>
                    <p className="font-medium">{selectedSectorData.totalCount}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Faturamento Total:</span>
                    <p className="font-medium">R$ {selectedSectorData.totalValue.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">% do Faturamento Geral:</span>
                    <p className="font-medium">{((selectedSectorData.totalValue / totalRevenue) * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Ticket Médio:</span>
                    <p className="font-medium">R$ {(selectedSectorData.totalValue / selectedSectorData.totalCount).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>



      {/* Análise Detalhada por Segmento */}
      {viewMode === 'segments' && selectedSectorData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4" />
              Análise Detalhada dos Segmentos - {selectedSector}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Segmento</th>
                    <th className="text-right p-2">Empresas</th>
                    <th className="text-right p-2">Faturamento</th>
                    <th className="text-right p-2">% do Total</th>
                    <th className="text-right p-2">% do Setor</th>
                    <th className="text-right p-2">Ticket Médio</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(selectedSectorData.segments)
                    .sort((a: any, b: any) => b.value - a.value)
                    .map((segment: any) => (
                      <tr key={segment.name} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{segment.name}</td>
                        <td className="p-2 text-right">{segment.count}</td>
                        <td className="p-2 text-right text-green-600 font-medium">
                          R$ {segment.value.toLocaleString('pt-BR')}
                        </td>
                        <td className="p-2 text-right text-blue-600">
                          {segment.revenueShare.toFixed(1)}%
                        </td>
                        <td className="p-2 text-right text-purple-600">
                          {segment.sectorShare.toFixed(1)}%
                        </td>
                        <td className="p-2 text-right text-orange-600 font-medium">
                          R$ {segment.averageValue.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 
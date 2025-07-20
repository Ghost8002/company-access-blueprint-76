
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MacOSCardAnimated } from '@/components/ui/macos-card-animated';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Info } from 'lucide-react';
import { Company } from '../../../types/company';
import { FinancialChartModal } from './FinancialChartModal';
import { MacOSFade } from '@/components/ui/macos-animations';

interface SectorSegmentAnalysisProps {
  companies: Company[];
  onSectorSelect?: (sector: string) => void;
  selectedSector?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export const SectorSegmentAnalysisChart = ({ 
  companies, 
  onSectorSelect, 
  selectedSector = 'all' 
}: SectorSegmentAnalysisProps) => {
  const [showModal, setShowModal] = useState(false);

  // Agrupar por setor e calcular totais
  const sectorData = companies.reduce((acc, company) => {
    const sector = company.companySector || 'Não informado';
    if (!acc[sector]) {
      acc[sector] = { name: sector, value: 0, count: 0 };
    }
    acc[sector].value += company.honoraryValue || 0;
    acc[sector].count += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);

  // Preparar dados para o gráfico
  const chartData = Object.values(sectorData)
    .filter(sector => sector.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const modalData = chartData.map(item => ({
    name: item.name,
    value: item.value,
    count: item.count,
    percentage: ((item.value / companies.reduce((sum, c) => sum + (c.honoraryValue || 0), 0)) * 100).toFixed(1) + '%'
  }));

  const handleBarClick = (data: any) => {
    if (onSectorSelect) {
      onSectorSelect(data.name);
    }
  };

  const handleResetFilter = () => {
    if (onSectorSelect) {
      onSectorSelect('all');
    }
  };

  const handleChartClick = () => {
    setShowModal(true);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          <p className="text-blue-600 text-sm">
            Faturamento: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(data.value)}
          </p>
          <p className="text-green-600 text-sm">
            Empresas: {data.count}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <MacOSFade>
      <MacOSCardAnimated 
        interactive 
        glassEffect 
        className="cursor-pointer hover:shadow-xl transition-all duration-300" 
        onClick={handleChartClick}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Análise por Setores</CardTitle>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Como usar este gráfico:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Clique em uma barra para filtrar a tabela por setor</li>
                      <li>• Use o botão "Todos os Setores" para remover filtros</li>
                      <li>• Clique no gráfico para ver dados detalhados</li>
                      <li>• Passe o mouse sobre as barras para ver informações</li>
                    </ul>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleResetFilter}
                variant={selectedSector === 'all' ? 'default' : 'outline'}
                size="sm"
              >
                Todos os Setores
              </Button>
              {selectedSector !== 'all' && (
                <div className="text-sm text-blue-600 font-medium">
                  Filtrado: {selectedSector}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => 
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    notation: 'compact'
                  }).format(value)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#0088FE"
                onClick={handleBarClick}
                className="cursor-pointer hover:opacity-80"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </MacOSCardAnimated>

      <FinancialChartModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Análise por Setores"
        data={modalData}
        columns={[
          { key: 'name', label: 'Setor' },
          { key: 'count', label: 'Empresas' },
          { key: 'value', label: 'Faturamento', 
            render: (value) => new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(value as number)
          },
          { key: 'percentage', label: '% do Total' }
        ]}
      />
    </MacOSFade>
  );
};

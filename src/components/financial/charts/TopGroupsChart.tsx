
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MacOSCardAnimated } from '@/components/ui/macos-card-animated';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '../../../types/company';
import { FinancialChartModal } from './FinancialChartModal';
import { MacOSFade } from '@/components/ui/macos-animations';

interface TopGroupsChartProps {
  companies: Company[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

// Função para encurtar nomes de setores
const getSectorShortName = (sectorName: string): string => {
  const sectorMap: Record<string, string> = {
    'MATERIAIS DE CONSTRUÇÃO': 'MAT. CONSTRUÇÃO',
    'PRODUTOS DOMÉSTICOS': 'PROD. DOMÉSTICOS',
    'SUPERMERCADO': 'SUPERMERCADO',
    'CONFECÇÕES': 'CONFECÇÕES',
    'COMBUSTÍVEIS': 'COMBUSTÍVEIS',
    'ELETRÔNICOS': 'ELETRÔNICOS',
    'INFORMÁTICA': 'INFORMÁTICA',
    'FARMÁCIA': 'FARMÁCIA',
    'RESTAURANTE': 'RESTAURANTE',
    'VARIEDADES': 'VARIEDADES',
    'AUTOPEÇAS': 'AUTOPEÇAS',
    'MATERIAIS HOSPITALARES': 'MAT. HOSPITALARES',
    'MÓVEIS': 'MÓVEIS',
    'COSMÉTICOS': 'COSMÉTICOS',
    'EQUIPAMENTOS': 'EQUIPAMENTOS',
    'SERVIÇOS': 'SERVIÇOS',
    'COMÉRCIO': 'COMÉRCIO',
    'INDÚSTRIA': 'INDÚSTRIA',
    'PRODUTOR RURAL': 'PROD. RURAL',
    'TERCEIRO SETOR': '3º SETOR',
    'CONSTRUÇÃO CIVIL': 'CONSTRUÇÃO',
    'TECNOLOGIA': 'TECNOLOGIA',
    'SAÚDE': 'SAÚDE',
    'EDUCAÇÃO': 'EDUCAÇÃO',
    'TRANSPORTE': 'TRANSPORTE',
    'AGRONEGÓCIO': 'AGRONEGÓCIO',
    'FINANCEIRO': 'FINANCEIRO',
    'ENERGIA': 'ENERGIA',
    'TELECOMUNICAÇÕES': 'TELECOM'
  };
  
  return sectorMap[sectorName] || sectorName;
};

export const TopGroupsChart = ({ companies }: TopGroupsChartProps) => {
  const [showModal, setShowModal] = useState(false);

  const totalRevenue = companies.reduce((sum, c) => sum + (c.honoraryValue || 0), 0);

  // Agrupar por setor da empresa e calcular totais
  const sectorData = companies.reduce((acc, company) => {
    const sector = company.companySector || 'Não informado';
    if (!acc[sector]) {
      acc[sector] = { name: sector, shortName: getSectorShortName(sector), value: 0, count: 0 };
    }
    acc[sector].value += company.honoraryValue || 0;
    acc[sector].count += 1;
    return acc;
  }, {} as Record<string, { name: string; shortName: string; value: number; count: number }>);

  // Pegar top setores e calcular percentuais
  const topSectors = Object.values(sectorData)
    .filter(sector => sector.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .map(sector => ({
      ...sector,
      percentage: (sector.value / totalRevenue * 100).toFixed(1)
    }));

  const modalData = topSectors.map(item => ({
    name: item.name,
    value: item.value,
    count: item.count,
    percentage: item.percentage + '%'
  }));

  const handleChartClick = () => {
    setShowModal(true);
  };

  // Tooltip customizado com informações completas
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-1">{data.name}</p>
          <p className="text-blue-600 text-sm">
            Faturamento: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(data.value)}
          </p>
          <p className="text-green-600 text-sm">
            Empresas: {data.count}
          </p>
          <p className="text-purple-600 text-sm">
            Participação: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Legenda customizada com nomes curtos
  const CustomLegend = (props: any) => {
    const { payload } = props;
    if (!payload) return null;

    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1 text-xs">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">
              {entry.payload.shortName} ({entry.payload.percentage}%)
            </span>
          </div>
        ))}
      </div>
    );
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
          <CardTitle>Setores por Faturamento</CardTitle>
          <CardDescription>
            Participação dos setores no faturamento total (passe o mouse para detalhes)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={topSectors}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ shortName, percentage }) => `${shortName} (${percentage}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {topSectors.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </MacOSCardAnimated>

      <FinancialChartModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Setores por Faturamento"
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

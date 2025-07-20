
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Company } from '../../../types/company';

interface AdvancedAnalyticsChartProps {
  companies: Company[];
}

interface AnalysisData {
  name: string;
  value: number;
  percentage: number;
  factors: string[];
  details: string;
}

export const AdvancedAnalyticsChart = ({ companies }: AdvancedAnalyticsChartProps) => {
  const analyticsData = useMemo(() => {
    if (!companies.length) return { regimeAnalysis: [], sectorAnalysis: [], complexityAnalysis: [] };

    const totalCompanies = companies.length;
    const totalRevenue = companies.reduce((sum, company) => sum + (company.honoraryValue || 0), 0);

    // Análise por regime tributário
    const regimeStats = companies.reduce((acc, company) => {
      const regime = company.newTaxRegime || 'Não informado';
      if (!acc[regime]) {
        acc[regime] = { count: 0, revenue: 0 };
      }
      acc[regime].count += 1;
      acc[regime].revenue += company.honoraryValue || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    const regimeAnalysis: AnalysisData[] = Object.entries(regimeStats).map(([regime, stats]) => ({
      name: regime,
      value: stats.revenue,
      percentage: (stats.count / totalCompanies) * 100,
      factors: [
        `${stats.count} empresas`,
        `${((stats.revenue / totalRevenue) * 100).toFixed(1)}% da receita total`,
        regime === 'SIMPLES NACIONAL' ? 'Mais comum para PMEs' : 
        regime === 'LUCRO PRESUMIDO' ? 'Médio porte' : 'Grandes empresas'
      ],
      details: `Receita média: R$ ${(stats.revenue / stats.count).toFixed(2)}`
    }));

    // Análise por setor
    const sectorStats = companies.reduce((acc, company) => {
      const sector = company.companySector || 'Não informado';
      if (!acc[sector]) {
        acc[sector] = { count: 0, revenue: 0 };
      }
      acc[sector].count += 1;
      acc[sector].revenue += company.honoraryValue || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    const sectorAnalysis: AnalysisData[] = Object.entries(sectorStats).map(([sector, stats]) => ({
      name: sector,
      value: stats.revenue,
      percentage: (stats.count / totalCompanies) * 100,
      factors: [
        `${stats.count} empresas`,
        `${((stats.revenue / totalRevenue) * 100).toFixed(1)}% da receita total`
      ],
      details: `Receita média: R$ ${(stats.revenue / stats.count).toFixed(2)}`
    }));

    // Análise por complexidade
    const complexityStats = companies.reduce((acc, company) => {
      const complexity = company.complexityLevel || 'Não informado';
      if (!acc[complexity]) {
        acc[complexity] = { count: 0, revenue: 0 };
      }
      acc[complexity].count += 1;
      acc[complexity].revenue += company.honoraryValue || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    const complexityAnalysis: AnalysisData[] = Object.entries(complexityStats).map(([complexity, stats]) => ({
      name: complexity,
      value: stats.revenue,
      percentage: (stats.count / totalCompanies) * 100,
      factors: [
        `${stats.count} empresas`,
        `${((stats.revenue / totalRevenue) * 100).toFixed(1)}% da receita total`,
        complexity === 'High' ? 'Maior valor por empresa' : 
        complexity === 'Medium' ? 'Valor intermediário' : 'Menor valor por empresa'
      ],
      details: `Receita média: R$ ${(stats.revenue / stats.count).toFixed(2)}`
    }));

    return { regimeAnalysis, sectorAnalysis, complexityAnalysis };
  }, [companies]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as AnalysisData;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">Valor: R$ {data.value.toLocaleString('pt-BR')}</p>
          <p className="text-sm text-gray-600">Participação: {data.percentage.toFixed(1)}%</p>
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-700">Fatores:</p>
            {data.factors.map((factor, index) => (
              <p key={index} className="text-xs text-gray-600">• {factor}</p>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">{data.details}</p>
        </div>
      );
    }
    return null;
  };

  const handleChartClick = (data: AnalysisData) => {
    console.log('Análise detalhada:', data);
  };

  if (companies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise Avançada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            Nenhuma empresa encontrada para análise
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Análise por Regime Tributário */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Análise por Regime Tributário</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.regimeAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis fontSize={10} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#8884d8"
                onClick={handleChartClick}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análise por Setor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Distribuição por Setor</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analyticsData.sectorAnalysis}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.sectorAnalysis.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análise por Complexidade */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Análise por Complexidade</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.complexityAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                fontSize={10}
              />
              <YAxis fontSize={10} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#82ca9d"
                onClick={handleChartClick}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

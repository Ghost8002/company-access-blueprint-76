import React from 'react';
import { Company } from '../../types/company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CompanyChartsProps {
  companies: Company[];
}

export const CompanyCharts = ({ companies }: CompanyChartsProps) => {
  // Verificar se há empresas para mostrar
  if (!companies || companies.length === 0) {
    return (
      <Card className="mb-2">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs">Distribuição por Setor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 flex items-center justify-center text-gray-500 text-xs">
            Nenhuma empresa encontrada
          </div>
        </CardContent>
      </Card>
    );
  }

  // Dados para gráfico por setor
  const sectorData = companies.reduce((acc, company) => {
    const sector = company.companySector || 'Não informado';
    const honoraryValue = company.honoraryValue || 0;
    
    if (!acc[sector]) {
      acc[sector] = {
        name: sector,
        count: 0,
        totalValue: 0
      };
    }
    
    acc[sector].count += 1;
    acc[sector].totalValue += honoraryValue;
    
    return acc;
  }, {} as Record<string, { name: string; count: number; totalValue: number }>);

  const chartData = Object.values(sectorData)
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 4) // Mostrar apenas os 4 principais setores
    .map(item => ({
      ...item,
      totalValue: Math.round(item.totalValue * 100) / 100
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-1 border rounded shadow text-xs">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">Qtd: {payload[0].payload.count}</p>
          <p className="text-green-600">R$ {payload[0].payload.totalValue.toLocaleString('pt-BR')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mb-2">
      <CardHeader className="pb-1">
        <CardTitle className="text-xs flex items-center gap-2">
          <span>Distribuição por Setor</span>
          <span className="text-xs text-gray-500">
            ({companies.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={25}
                fontSize={8}
                tick={{ fontSize: 7 }}
              />
              <YAxis 
                orientation="left" 
                stroke="#3B82F6"
                fontSize={8}
                tick={{ fontSize: 7 }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="totalValue" 
                fill="#3B82F6" 
                name="Valor Total (R$)"
                radius={[1, 1, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}; 
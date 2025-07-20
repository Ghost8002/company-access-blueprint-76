
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MacOSCardAnimated } from '@/components/ui/macos-card-animated';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '../../../types/company';
import { MacOSFade } from '@/components/ui/macos-animations';
import { formatCurrency } from '../../../utils/formatters';

interface MonthlyRevenueChartProps {
  companies: Company[];
}

export const MonthlyRevenueChart = ({ companies }: MonthlyRevenueChartProps) => {
  // Filtrar empresas com dados válidos
  const validCompanies = companies.filter(company => 
    company.honoraryValue && company.honoraryValue > 0 && company.name && company.name.trim() !== ''
  );
  
  // Simular receita mensal (em um sistema real, isso viria de dados históricos)
  const totalMonthlyRevenue = validCompanies.reduce((sum, c) => sum + (c.honoraryValue || 0), 0);
  
  const monthlyData = [
    { month: 'Jan', revenue: totalMonthlyRevenue * 0.8, id: 'jan' },
    { month: 'Fev', revenue: totalMonthlyRevenue * 0.85, id: 'fev' },
    { month: 'Mar', revenue: totalMonthlyRevenue * 0.9, id: 'mar' },
    { month: 'Abr', revenue: totalMonthlyRevenue * 0.95, id: 'abr' },
    { month: 'Mai', revenue: totalMonthlyRevenue, id: 'mai' },
    { month: 'Jun', revenue: totalMonthlyRevenue * 1.05, id: 'jun' },
  ];

  return (
    <MacOSFade>
      <MacOSCardAnimated interactive glassEffect>
        <CardHeader>
          <CardTitle>Evolução da Receita Mensal</CardTitle>
          <CardDescription>
            Projeção baseada nos honorários atuais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value).replace('R$ ', 'R$')}
              />
              <Tooltip 
                formatter={(value) => [
                  formatCurrency(value as number),
                  'Receita'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#82ca9d" 
                strokeWidth={2}
                dot={{ fill: '#82ca9d' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </MacOSCardAnimated>
    </MacOSFade>
  );
};

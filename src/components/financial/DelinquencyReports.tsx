
import React, { useState } from 'react';
import { useCompanies } from '../../contexts/CompanyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, DollarSign, TrendingDown, TrendingUp, Users, Calendar, Eye } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface CompanyDetailModalProps {
  companies: any[];
  title: string;
  onClose: () => void;
}

const CompanyDetailModal = ({ companies, title, onClose }: CompanyDetailModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </div>
      <div className="p-6 overflow-y-auto max-h-[60vh]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Valor Honorário</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{formatCurrency(company.honoraryValue || 0)}</TableCell>
                <TableCell>
                  <Badge className={company.delinquencyStatus === 'inadimplente' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                    {company.delinquencyStatus === 'inadimplente' ? 'Inadimplente' : 'Sem Débitos'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
);

export const DelinquencyReports = () => {
  const { companies } = useCompanies();
  const [selectedModal, setSelectedModal] = useState<{ companies: any[], title: string } | null>(null);

  const companiesWithValue = companies.filter(c => c.honoraryValue && c.honoraryValue > 0);
  const delinquentCompanies = companiesWithValue.filter(c => c.delinquencyStatus === 'inadimplente');
  const activeCompanies = companiesWithValue.filter(c => c.delinquencyStatus === 'sem_debitos');

  const totalRevenue = companiesWithValue.reduce((sum, c) => sum + (c.honoraryValue || 0), 0);
  const delinquentRevenue = delinquentCompanies.reduce((sum, c) => sum + (c.honoraryValue || 0), 0);
  const activeRevenue = activeCompanies.reduce((sum, c) => sum + (c.honoraryValue || 0), 0);

  // Top 10 Rankings
  const topSegments = Object.entries(
    companiesWithValue.reduce((acc, company) => {
      const segment = company.segment || 'Não informado';
      if (!acc[segment]) {
        acc[segment] = { total: 0, companies: [] };
      }
      acc[segment].total += company.honoraryValue || 0;
      acc[segment].companies.push(company);
      return acc;
    }, {} as Record<string, { total: number; companies: any[] }>)
  )
    .map(([segment, data]) => ({ segment, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const topGroups = Object.entries(
    companiesWithValue.reduce((acc, company) => {
      const group = company.group || 'Sem grupo';
      if (!acc[group]) {
        acc[group] = { total: 0, companies: [] };
      }
      acc[group].total += company.honoraryValue || 0;
      acc[group].companies.push(company);
      return acc;
    }, {} as Record<string, { total: number; companies: any[] }>)
  )
    .map(([group, data]) => ({ group, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const topRegimes = Object.entries(
    companiesWithValue.reduce((acc, company) => {
      const regime = company.newTaxRegime || company.taxRegime || 'Não informado';
      if (!acc[regime]) {
        acc[regime] = { total: 0, companies: [] };
      }
      acc[regime].total += company.honoraryValue || 0;
      acc[regime].companies.push(company);
      return acc;
    }, {} as Record<string, { total: number; companies: any[] }>)
  )
    .map(([regime, data]) => ({ regime, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Delinquency comparison data
  const comparisonData = [
    {
      name: 'Com Inadimplentes',
      'Receita Total': totalRevenue,
      'Receita Ativa': activeRevenue,
      'Receita Inadimplente': delinquentRevenue
    }
  ];

  const delinquencyDistribution = [
    { name: 'Sem Débitos', value: activeRevenue, count: activeCompanies.length, color: '#10B981' },
    { name: 'Inadimplentes', value: delinquentRevenue, count: delinquentCompanies.length, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Relatórios de Inadimplência</h2>
        <p className="text-gray-600">Análise detalhada da situação financeira e inadimplência</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="rankings">Rankings Top 10</TabsTrigger>
          <TabsTrigger value="delinquency">Análise Inadimplência</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Receita Total</p>
                    <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalRevenue)}</p>
                    <p className="text-xs text-blue-600 mt-1">{companiesWithValue.length} empresas</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Receita Ativa</p>
                    <p className="text-2xl font-bold text-green-800">{formatCurrency(activeRevenue)}</p>
                    <p className="text-xs text-green-600 mt-1">{activeCompanies.length} empresas</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Receita Inadimplente</p>
                    <p className="text-2xl font-bold text-red-800">{formatCurrency(delinquentRevenue)}</p>
                    <p className="text-xs text-red-600 mt-1">{delinquentCompanies.length} empresas</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Taxa Inadimplência</p>
                    <p className="text-2xl font-bold text-orange-800">
                      {((delinquentRevenue / totalRevenue) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-orange-600 mt-1">da receita total</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Distribuição */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição da Receita por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={delinquencyDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, count }) => `${name}: ${formatCurrency(value)} (${count})`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {delinquencyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top 10 Segmentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Top 10 Segmentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topSegments.map((item, index) => (
                    <div key={item.segment} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                        <div>
                          <p className="font-medium text-sm">{item.segment}</p>
                          <p className="text-xs text-gray-600">{item.companies.length} empresas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatCurrency(item.total)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedModal({ 
                            companies: item.companies, 
                            title: `Empresas do Segmento: ${item.segment}` 
                          })}
                          className="h-6 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top 10 Grupos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Top 10 Grupos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topGroups.map((item, index) => (
                    <div key={item.group} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                        <div>
                          <p className="font-medium text-sm">{item.group}</p>
                          <p className="text-xs text-gray-600">{item.companies.length} empresas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">{formatCurrency(item.total)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedModal({ 
                            companies: item.companies, 
                            title: `Empresas do Grupo: ${item.group}` 
                          })}
                          className="h-6 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top 10 Regimes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-orange-500" />
                  Top 10 Regimes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topRegimes.map((item, index) => (
                    <div key={item.regime} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                        <div>
                          <p className="font-medium text-sm">{item.regime}</p>
                          <p className="text-xs text-gray-600">{item.companies.length} empresas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">{formatCurrency(item.total)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedModal({ 
                            companies: item.companies, 
                            title: `Empresas do Regime: ${item.regime}` 
                          })}
                          className="h-6 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="delinquency" className="space-y-6">
          {/* Comparação de Receitas */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação: Receita Com vs Sem Inadimplentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="Receita Total" fill="#3B82F6" />
                    <Bar dataKey="Receita Ativa" fill="#10B981" />
                    <Bar dataKey="Receita Inadimplente" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Empresas Inadimplentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Empresas Inadimplentes ({delinquentCompanies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Valor Honorário</TableHead>
                    <TableHead>Início Inadimplência</TableHead>
                    <TableHead>Duração</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {delinquentCompanies.map((company) => {
                    const startDate = company.delinquencyStartDate ? new Date(company.delinquencyStartDate) : null;
                    const duration = startDate 
                      ? Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                      : 0;
                    
                    return (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{formatCurrency(company.honoraryValue || 0)}</TableCell>
                        <TableCell>
                          {startDate ? startDate.toLocaleDateString('pt-BR') : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span>{duration} dias</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para detalhes das empresas */}
      {selectedModal && (
        <CompanyDetailModal
          companies={selectedModal.companies}
          title={selectedModal.title}
          onClose={() => setSelectedModal(null)}
        />
      )}
    </div>
  );
};

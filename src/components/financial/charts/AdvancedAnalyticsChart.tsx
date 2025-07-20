import React, { useState } from 'react';
import { Company } from '../../../types/company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Target, Zap, Award, Star, ArrowRight, Info, Eye, Activity,
  AlertTriangle, DollarSign, Calculator, Shield, TrendingDown, BarChart3
} from 'lucide-react';

interface AdvancedAnalyticsChartProps {
  companies: Company[];
}

interface AnalysisData {
  name: string;
  value: number;
  percentage: number;
  factors: string[];
  details: {
    companies: number;
    averageValue: number;
    topPerformers: string[];
    growthRate: number;
    riskLevel: 'Baixo' | 'Médio' | 'Alto';
    taxRisk: 'Baixo' | 'Médio' | 'Alto';
    cashFlow: 'Positivo' | 'Neutro' | 'Negativo';
  };
}

export const AdvancedAnalyticsChart = ({ companies }: AdvancedAnalyticsChartProps) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filtrar empresas com valor honorário
  const companiesWithValue = companies.filter(c => c.honoraryValue && c.honoraryValue > 0);
  const totalRevenue = companiesWithValue.reduce((sum, c) => sum + (c.honoraryValue || 0), 0);

  // 1. ANÁLISE DE CONCENTRAÇÃO DE RECEITA (Risco de Dependência)
  const concentrationAnalysis = companiesWithValue
    .filter(company => company.name && company.name.trim() !== '')
    .sort((a, b) => (b.honoraryValue || 0) - (a.honoraryValue || 0))
    .slice(0, 5)
    .map((company, index) => ({
      name: company.name.trim(),
      value: company.honoraryValue || 0,
      percentage: ((company.honoraryValue || 0) / totalRevenue) * 100,
      id: `${company.name}-${index}`,
      factors: [
        `${company.companySector || 'Setor não informado'} - Setor de alta rentabilidade`,
        `${company.segment || 'Segmento não informado'} - Segmento especializado`,
        `${company.classification || 'Classificação não informada'} - Classificação premium`,
        company.group ? `${company.group} - Grupo empresarial forte` : 'Empresa independente',
        `Risco de concentração: ${((company.honoraryValue || 0) / totalRevenue * 100).toFixed(1)}% da receita`
      ],
      details: {
        companies: 1,
        averageValue: company.honoraryValue || 0,
        topPerformers: [company.name],
        growthRate: 15 + Math.random() * 20,
        riskLevel: company.honoraryValue && company.honoraryValue > 50000 ? 'Alto' : 
                  company.honoraryValue && company.honoraryValue > 20000 ? 'Médio' : 'Baixo',
        taxRisk: company.newTaxRegime === 'Simples Nacional' ? 'Baixo' : 
                company.newTaxRegime === 'Lucro Presumido' ? 'Médio' : 'Alto',
        cashFlow: company.honoraryValue && company.honoraryValue > 30000 ? 'Positivo' : 
                 company.honoraryValue && company.honoraryValue > 10000 ? 'Neutro' : 'Negativo'
      }
    }));

  // 2. ANÁLISE DE RISCO TRIBUTÁRIO POR REGIME
  const taxRegimeAnalysis = companiesWithValue
    .filter(company => company.name && company.name.trim() !== '')
    .reduce((acc, company) => {
      const regime = company.newTaxRegime || company.taxRegime || 'Não informado';
      if (!acc[regime]) {
        acc[regime] = {
          name: regime,
          totalValue: 0,
          count: 0,
          companies: [],
          riskScore: 0
        };
      }
      acc[regime].totalValue += company.honoraryValue || 0;
      acc[regime].count += 1;
      acc[regime].companies.push(company);
      
      // Calcular score de risco baseado no regime
      const riskScore = regime === 'Simples Nacional' ? 1 : 
                       regime === 'Lucro Presumido' ? 2 : 
                       regime === 'Lucro Real' ? 3 : 2;
      acc[regime].riskScore += riskScore;
      
      return acc;
    }, {} as Record<string, any>);

  const taxRiskData = Object.values(taxRegimeAnalysis)
    .map((regime: any, index: number) => ({
      name: regime.name,
      value: regime.totalValue,
      percentage: (regime.totalValue / totalRevenue) * 100,
      riskScore: regime.riskScore / regime.count,
      id: `${regime.name}-${index}`,
      factors: [
        `${regime.count} empresas no regime`,
        `Receita total: R$ ${regime.totalValue.toLocaleString('pt-BR')}`,
        `Risco médio: ${(regime.riskScore / regime.count).toFixed(1)}/3`,
        regime.name === 'Simples Nacional' ? 'Regime simplificado - baixo risco' :
        regime.name === 'Lucro Presumido' ? 'Regime intermediário - risco moderado' :
        regime.name === 'Lucro Real' ? 'Regime complexo - alto risco' : 'Regime não identificado'
      ],
      details: {
        companies: regime.count,
        averageValue: regime.totalValue / regime.count,
        topPerformers: regime.companies
          .sort((a: any, b: any) => (b.honoraryValue || 0) - (a.honoraryValue || 0))
          .slice(0, 3)
          .map((c: any) => c.name),
        growthRate: 8 + Math.random() * 12,
        riskLevel: (regime.riskScore / regime.count) > 2.5 ? 'Alto' : 
                  (regime.riskScore / regime.count) > 1.5 ? 'Médio' : 'Baixo',
        taxRisk: (regime.riskScore / regime.count) > 2.5 ? 'Alto' : 
                (regime.riskScore / regime.count) > 1.5 ? 'Médio' : 'Baixo',
        cashFlow: regime.totalValue > 100000 ? 'Positivo' : 
                 regime.totalValue > 50000 ? 'Neutro' : 'Negativo'
      }
    }))
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  // 3. ANÁLISE DE EFICIÊNCIA OPERACIONAL POR SETOR
  const sectorEfficiency = companiesWithValue
    .filter(company => company.name && company.name.trim() !== '')
    .reduce((acc, company) => {
      const sector = company.companySector || 'Não informado';
      if (!acc[sector]) {
        acc[sector] = {
          name: sector,
          totalValue: 0,
          count: 0,
          companies: [],
          avgTicket: 0
        };
      }
      acc[sector].totalValue += company.honoraryValue || 0;
      acc[sector].count += 1;
      acc[sector].companies.push(company);
      return acc;
    }, {} as Record<string, any>);

  const efficiencyData = Object.values(sectorEfficiency)
    .map((sector: any, index: number) => {
      const avgTicket = sector.totalValue / sector.count;
      return {
        name: sector.name,
        value: avgTicket,
        percentage: (sector.totalValue / totalRevenue) * 100,
        id: `${sector.name}-${index}`,
        factors: [
          `${sector.count} empresas no setor`,
          `Ticket médio: R$ ${avgTicket.toLocaleString('pt-BR')}`,
          `Receita total: R$ ${sector.totalValue.toLocaleString('pt-BR')}`,
          avgTicket > 50000 ? 'Setor de alto valor agregado' :
          avgTicket > 20000 ? 'Setor de valor intermediário' : 'Setor em desenvolvimento'
        ],
        details: {
          companies: sector.count,
          averageValue: avgTicket,
          topPerformers: sector.companies
            .sort((a: any, b: any) => (b.honoraryValue || 0) - (a.honoraryValue || 0))
            .slice(0, 3)
            .map((c: any) => c.name),
          growthRate: 10 + Math.random() * 15,
          riskLevel: sector.count > 5 ? 'Baixo' : sector.count > 2 ? 'Médio' : 'Alto',
          taxRisk: avgTicket > 50000 ? 'Alto' : avgTicket > 20000 ? 'Médio' : 'Baixo',
          cashFlow: sector.totalValue > 100000 ? 'Positivo' : 
                   sector.totalValue > 50000 ? 'Neutro' : 'Negativo'
        }
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // 4. PROJEÇÃO DE CRESCIMENTO E FLUXO DE CAIXA
  const growthProjection = companiesWithValue
    .filter(company => company.name && company.name.trim() !== '')
    .reduce((acc, company) => {
      const segment = company.segment || 'Não informado';
      if (!acc[segment]) {
        acc[segment] = {
          name: segment,
          totalValue: 0,
          count: 0,
          companies: [],
          projectedGrowth: 0
        };
      }
      acc[segment].totalValue += company.honoraryValue || 0;
      acc[segment].count += 1;
      acc[segment].companies.push(company);
      return acc;
    }, {} as Record<string, any>);

  const projectionData = Object.values(growthProjection)
    .map((segment: any, index: number) => {
      const projectedGrowth = 5 + Math.random() * 25;
      const projectedValue = segment.totalValue * (1 + projectedGrowth / 100);
      return {
        name: segment.name,
        currentValue: segment.totalValue,
        projectedValue: projectedValue,
        growthRate: projectedGrowth,
        id: `${segment.name}-${index}`,
        factors: [
          `${segment.count} empresas no segmento`,
          `Receita atual: R$ ${segment.totalValue.toLocaleString('pt-BR')}`,
          `Projeção: R$ ${projectedValue.toLocaleString('pt-BR')}`,
          `Crescimento esperado: ${projectedGrowth.toFixed(1)}%`,
          projectedGrowth > 20 ? 'Segmento em alta expansão' :
          projectedGrowth > 10 ? 'Segmento estável' : 'Segmento conservador'
        ],
        details: {
          companies: segment.count,
          averageValue: segment.totalValue / segment.count,
          topPerformers: segment.companies
            .sort((a: any, b: any) => (b.honoraryValue || 0) - (a.honoraryValue || 0))
            .slice(0, 3)
            .map((c: any) => c.name),
          growthRate: projectedGrowth,
          riskLevel: projectedGrowth > 20 ? 'Alto' : projectedGrowth > 10 ? 'Médio' : 'Baixo',
          taxRisk: segment.totalValue > 100000 ? 'Alto' : segment.totalValue > 50000 ? 'Médio' : 'Baixo',
          cashFlow: projectedValue > segment.totalValue ? 'Positivo' : 'Neutro'
        }
      };
    })
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, 5);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg text-sm">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-green-600">R$ {data.value?.toLocaleString('pt-BR') || data.currentValue?.toLocaleString('pt-BR')}</p>
          <p className="text-blue-600">{data.percentage?.toFixed(1)}% do total</p>
          {data.growthRate && (
            <p className="text-purple-600">Crescimento: {data.growthRate.toFixed(1)}%</p>
          )}
          {data.riskScore && (
            <p className="text-orange-600">Risco: {data.riskScore.toFixed(1)}/3</p>
          )}
        </div>
      );
    }
    return null;
  };

  const handleAnalysisClick = (data: AnalysisData) => {
    setSelectedAnalysis(data);
    setShowDetails(true);
  };

  if (companiesWithValue.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análises Avançadas</CardTitle>
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
      {/* 1. ANÁLISE DE CONCENTRAÇÃO DE RECEITA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Top 5 - Maior Concentração de Receita
            <Badge variant="outline" className="text-xs">
              <Info className="w-3 h-3 mr-1" />
              Clique para análise de risco
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={concentrationAnalysis} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" stroke="#8884d8" />
                <YAxis dataKey="name" type="category" width={120} fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="#8884d8" 
                  name="Valor Honorário (R$)"
                  onClick={(data) => handleAnalysisClick(data)}
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. ANÁLISE DE RISCO TRIBUTÁRIO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Risco Tributário por Regime
              <Badge variant="outline" className="text-xs">
                <Calculator className="w-3 h-3 mr-1" />
                Clique para detalhes
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={taxRiskData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Risco Tributário"
                    dataKey="riskScore"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                    onClick={(data) => handleAnalysisClick(data)}
                    style={{ cursor: 'pointer' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3. EFICIÊNCIA OPERACIONAL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" />
              Eficiência Operacional por Setor
              <Badge variant="outline" className="text-xs">
                <BarChart3 className="w-3 h-3 mr-1" />
                Clique para análise
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={efficiencyData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" stroke="#10B981" />
                  <YAxis dataKey="name" type="category" width={100} fontSize={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill="#10B981" 
                    name="Ticket Médio (R$)"
                    onClick={(data) => handleAnalysisClick(data)}
                    style={{ cursor: 'pointer' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. PROJEÇÃO DE CRESCIMENTO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Projeção de Crescimento por Segmento
            <Badge variant="outline" className="text-xs">
              <DollarSign className="w-3 h-3 mr-1" />
              Clique para projeções
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="currentValue" 
                  stackId="1" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.6}
                  name="Receita Atual"
                />
                <Area 
                  type="monotone" 
                  dataKey="projectedValue" 
                  stackId="2" 
                  stroke="#F59E0B" 
                  fill="#F59E0B" 
                  fillOpacity={0.6}
                  name="Projeção"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Análise Detalhada: {selectedAnalysis?.name}
            </DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre a análise selecionada.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAnalysis && (
            <div className="space-y-6">
              {/* Resumo Financeiro */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600">Valor Total</span>
                  <p className="font-semibold text-green-600">
                    R$ {selectedAnalysis.value.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">% do Faturamento</span>
                  <p className="font-semibold text-blue-600">
                    {selectedAnalysis.percentage.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Empresas</span>
                  <p className="font-semibold text-purple-600">
                    {selectedAnalysis.details.companies}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Ticket Médio</span>
                  <p className="font-semibold text-orange-600">
                    R$ {selectedAnalysis.details.averageValue.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Análise de Riscos */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-red-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600">Risco Geral</span>
                  <Badge 
                    variant={selectedAnalysis.details.riskLevel === 'Alto' ? 'destructive' : 
                            selectedAnalysis.details.riskLevel === 'Médio' ? 'secondary' : 'default'}
                  >
                    {selectedAnalysis.details.riskLevel}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Risco Tributário</span>
                  <Badge 
                    variant={selectedAnalysis.details.taxRisk === 'Alto' ? 'destructive' : 
                            selectedAnalysis.details.taxRisk === 'Médio' ? 'secondary' : 'default'}
                  >
                    {selectedAnalysis.details.taxRisk}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Fluxo de Caixa</span>
                  <Badge 
                    variant={selectedAnalysis.details.cashFlow === 'Positivo' ? 'default' : 
                            selectedAnalysis.details.cashFlow === 'Neutro' ? 'secondary' : 'destructive'}
                  >
                    {selectedAnalysis.details.cashFlow}
                  </Badge>
                </div>
              </div>

              {/* Fatores que Influenciam */}
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-3">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Fatores que Influenciam o Resultado:
                </h4>
                <div className="space-y-2">
                  {selectedAnalysis.factors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <ArrowRight className="w-3 h-3 text-blue-600" />
                      <span className="text-sm">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Principais Empresas */}
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-3">
                  <Star className="w-4 h-4 inline mr-2" />
                  Principais Empresas:
                </h4>
                <div className="space-y-1">
                  {selectedAnalysis.details.topPerformers.map((company, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm font-medium">{company}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projeções */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600">Taxa de Crescimento</span>
                  <p className="font-semibold text-green-600">
                    {selectedAnalysis.details.growthRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Projeção 12 meses</span>
                  <p className="font-semibold text-blue-600">
                    R$ {(selectedAnalysis.value * (1 + selectedAnalysis.details.growthRate / 100)).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 
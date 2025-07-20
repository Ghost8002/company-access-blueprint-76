
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MacOSCardAnimated } from '@/components/ui/macos-card-animated';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTableModal } from './ChartTableModal';
import { MacOSFade } from '@/components/ui/macos-animations';

interface CompanySectorChartProps {
  data: { name: string; count: number }[];
}

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

export const CompanySectorChart = ({ data }: CompanySectorChartProps) => {
  const [showModal, setShowModal] = useState(false);

  // Processar dados para incluir nomes curtos
  const processedData = data.map(item => ({
    ...item,
    shortName: getSectorShortName(item.name)
  }));

  const handleChartClick = () => {
    setShowModal(true);
  };

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-1">{data.name}</p>
          <p className="text-blue-600 text-sm">
            Quantidade: {data.count} empresa{data.count > 1 ? 's' : ''}
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
          <CardTitle>Empresas por Setor</CardTitle>
          <CardDescription>
            Distribuição das empresas por setor de atividade (passe o mouse para detalhes)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="shortName" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                fontSize={10}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </MacOSCardAnimated>

      <ChartTableModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detalhes - Setor da Empresa"
        data={data}
      />
    </MacOSFade>
  );
};

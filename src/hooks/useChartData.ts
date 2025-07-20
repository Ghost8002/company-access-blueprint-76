import { useAuth } from '../contexts/AuthContext';
import { useCompanies } from '../contexts/CompanyContext';

export const useChartData = () => {
  const { user } = useAuth();
  const { companies } = useCompanies();

  const filteredCompanies = user?.role === 'root' ? companies : 
    user?.role === 'manager' ? companies :
    companies.filter(c => c.collaboratorIds.includes(user?.id || ''));

  // Calculate basic metrics using the newTaxRegime field
  const totalCompanies = filteredCompanies.length;
  const highComplexityCompanies = filteredCompanies.filter(c => c.complexityLevel === 'High').length;
  
  // Use newTaxRegime for the calculations
  const simplesNacionalCompanies = filteredCompanies.filter(c => 
    c.newTaxRegime === 'SIMPLES NACIONAL' || 
    (c.newTaxRegime === null && c.taxRegime === 'Simples Nacional')
  ).length;
  
  const lucroPresumidoCompanies = filteredCompanies.filter(c => 
    c.newTaxRegime === 'LUCRO PRESUMIDO' || 
    (c.newTaxRegime === null && c.taxRegime === 'Lucro Presumido')
  ).length;
  
  const lucroRealCompanies = filteredCompanies.filter(c => 
    c.newTaxRegime === 'LUCRO REAL' || 
    (c.newTaxRegime === null && c.taxRegime === 'Lucro Real')
  ).length;

  // Group companies by tax regime (legacy field)
  const regimeData = filteredCompanies.reduce((acc, company) => {
    const regime = company.taxRegime;
    if (!acc[regime]) {
      acc[regime] = { name: regime, count: 0 };
    }
    acc[regime].count += 1;
    return acc;
  }, {} as Record<string, { name: string; count: number }>);

  const taxRegimeChartData = Object.values(regimeData);

  // Group companies by complexity level
  const complexityData = filteredCompanies.reduce((acc, company) => {
    const complexity = company.complexityLevel || 'Low';
    if (!acc[complexity]) {
      acc[complexity] = { name: complexity, count: 0 };
    }
    acc[complexity].count += 1;
    return acc;
  }, {} as Record<string, { name: string; count: number }>);

  const complexityChartData = Object.values(complexityData);

  // Group companies by client class
  const clientClassData = filteredCompanies.reduce((acc, company) => {
    const clientClass = company.clientClass || 'Executive';
    if (!acc[clientClass]) {
      acc[clientClass] = { name: clientClass, count: 0 };
    }
    acc[clientClass].count += 1;
    return acc;
  }, {} as Record<string, { name: string; count: number }>);

  const clientClassChartData = Object.values(clientClassData);

  // Create sector vs client class data
  const sectorClientData = () => {
    const sectors = ['fiscal', 'pessoal', 'contabil', 'financeiro'];
    const clientClasses = ['Executive', 'VIP', 'Diamond'];
    
    return sectors.map(sector => {
      const sectorData: any = { name: sector };
      
      clientClasses.forEach(clientClass => {
        const count = filteredCompanies.filter(company => {
          const hasResponsible = company.sectorResponsibles?.[sector as keyof typeof company.sectorResponsibles];
          const hasClientClass = (company.clientClass || 'Executive') === clientClass;
          return hasResponsible && hasClientClass;
        }).length;
        
        sectorData[clientClass] = count;
      });
      
      return sectorData;
    });
  };

  const sectorVsClientData = sectorClientData();

  // Group companies by new tax regime
  const newTaxRegimeData = filteredCompanies.reduce((acc, company) => {
    const regime = company.newTaxRegime || 'Não informado';
    if (!acc[regime]) {
      acc[regime] = { name: regime, count: 0 };
    }
    acc[regime].count += 1;
    return acc;
  }, {} as Record<string, { name: string; count: number }>);

  const newTaxRegimeChartData = Object.values(newTaxRegimeData);

  // Group companies by sector
  const companySectorData = filteredCompanies.reduce((acc, company) => {
    const sector = company.companySector || 'Não informado';
    if (!acc[sector]) {
      acc[sector] = { name: sector, count: 0 };
    }
    acc[sector].count += 1;
    return acc;
  }, {} as Record<string, { name: string; count: number }>);

  const companySectorChartData = Object.values(companySectorData);

  // Group companies by municipality
  const municipalityData = filteredCompanies.reduce((acc, company) => {
    const municipality = company.municipality || 'Não informado';
    if (!acc[municipality]) {
      acc[municipality] = { name: municipality, count: 0 };
    }
    acc[municipality].count += 1;
    return acc;
  }, {} as Record<string, { name: string; count: number }>);

  const municipalityChartData = Object.values(municipalityData);

  // Group companies by classification
  const classificationData = filteredCompanies.reduce((acc, company) => {
    const classification = company.classification || 'Não informado';
    if (!acc[classification]) {
      acc[classification] = { name: classification, count: 0 };
    }
    acc[classification].count += 1;
    return acc;
  }, {} as Record<string, { name: string; count: number }>);

  const classificationChartData = Object.values(classificationData);

  // Group companies by situation
  const situationData = filteredCompanies.reduce((acc, company) => {
    const situation = company.situation || 'Não informado';
    if (!acc[situation]) {
      acc[situation] = { name: situation, count: 0 };
    }
    acc[situation].count += 1;
    return acc;
  }, {} as Record<string, { name: string; count: number }>);

  const situationChartData = Object.values(situationData);

  // Group companies by group
  const groupData = filteredCompanies.reduce((acc, company) => {
    const group = company.group || 'Sem grupo';
    if (!acc[group]) {
      acc[group] = { name: group, count: 0 };
    }
    acc[group].count += 1;
    return acc;
  }, {} as Record<string, { name: string; count: number }>);

  const groupChartData = Object.values(groupData);

  return {
    totalCompanies,
    highComplexityCompanies,
    simplesNacionalCompanies,
    lucroPresumidoCompanies,
    lucroRealCompanies,
    taxRegimeChartData,
    complexityChartData,
    clientClassChartData,
    sectorVsClientData,
    newTaxRegimeChartData,
    companySectorChartData,
    municipalityChartData,
    classificationChartData,
    situationChartData,
    groupChartData
  };
};

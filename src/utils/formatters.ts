// Utility functions for formatting values consistently across the application

export const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return 'R$ 0,00';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const parseCurrencyInput = (value: string): number | undefined => {
  if (!value || value.trim() === '') {
    return undefined;
  }
  
  // Remove currency symbols and format, keep only numbers and decimal separators
  const cleanValue = value
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
    
  const numericValue = parseFloat(cleanValue);
  return isNaN(numericValue) ? undefined : numericValue;
};

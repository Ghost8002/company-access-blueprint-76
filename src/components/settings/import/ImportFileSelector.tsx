
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface ImportFileSelectorProps {
  selectedFile: File | null;
  importing: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
  disabled?: boolean;
}

export const ImportFileSelector = ({ 
  selectedFile, 
  importing, 
  onFileSelect, 
  onImport,
  disabled = false
}: ImportFileSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="import-file" className="macos-text-primary">Selecionar arquivo Excel ou CSV para importação</Label>
      
      <div className="flex items-center space-x-2">
        <Input
          id="import-file"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={onFileSelect}
          disabled={importing || disabled}
          className="flex-1 macos-input macos-focus"
        />
        <Button 
          onClick={onImport} 
          disabled={importing || !selectedFile || disabled} 
          size="sm"
          className="macos-button-interactive macos-spring-hover macos-spring-tap"
        >
          <Upload className="w-4 h-4 mr-2" />
          {importing ? 'Importando...' : 'Importar'}
        </Button>
      </div>
      <p className="text-xs macos-text-tertiary">
        Arquivos CSV e Excel (.xlsx, .xls) são aceitos. Use o modelo Excel como referência.
        {disabled && (
          <span className="text-amber-600 dark:text-amber-400 block mt-1">
            Login com email/senha necessário para importar dados.
          </span>
        )}
      </p>
    </div>
  );
};

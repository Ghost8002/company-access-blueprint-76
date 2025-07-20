
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '../../types/company';
import { ExcelSampleDownload } from './import/ExcelSampleDownload';
import { ImportOptions } from './import/ImportOptions';
import { ImportFileSelector } from './import/ImportFileSelector';
import { ImportFieldsInfo } from './import/ImportFieldsInfo';
import { useImportCSV } from '../../hooks/useImportCSV';
import { useAuth } from '../../contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ImportSectionProps {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany?: (id: string, updates: Partial<Company>) => void;
}

export const ImportSection = ({ companies, addCompany, updateCompany }: ImportSectionProps) => {
  const { user } = useAuth();
  const isSupabaseUser = user && user.username.includes('@'); // Check if it's an email (Supabase user)
  
  const {
    importing,
    selectedFile,
    updateExisting,
    setUpdateExisting,
    handleFileSelect,
    handleImportCSV
  } = useImportCSV({ companies, addCompany, updateCompany });

  return (
    <Card className="macos-card macos-spring-hover">
      <CardHeader>
        <CardTitle className="macos-text-primary">Importar Dados</CardTitle>
        <CardDescription className="macos-text-secondary">
          Importe dados de empresas através de um arquivo CSV ou Excel com o novo formato da tabela.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSupabaseUser && (
          <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>Atenção:</strong> Para importar dados, você precisa fazer login com uma conta de email/senha. 
              O login local (usuário "luciano") não permite operações de banco de dados.
              <br />
              <span className="text-sm mt-1 block">
                Clique em "Criar Nova Conta" na tela de login para criar uma conta com email e senha.
              </span>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="macos-spring-hover">
            <ExcelSampleDownload />
          </div>

          <div className="space-y-3">
            <div className="macos-spring-hover">
              <ImportOptions 
                updateExisting={updateExisting}
                onUpdateExistingChange={setUpdateExisting}
              />
            </div>
            
            <div className="macos-spring-hover">
              <ImportFileSelector
                selectedFile={selectedFile}
                importing={importing}
                onFileSelect={handleFileSelect}
                onImport={handleImportCSV}
                disabled={!isSupabaseUser}
              />
            </div>
          </div>
        </div>

        <div className="macos-spring-hover">
          <ImportFieldsInfo />
        </div>
      </CardContent>
    </Card>
  );
};


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculatorForm } from '@/components/CalculatorForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { HistoryPanel } from '@/components/HistoryPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalculatorInputs, CalculationResult } from '@/types/calculator';
import { useCalculations } from '@/hooks/useCalculations';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const defaultInputs: CalculatorInputs = {
  estado: 'piaui',
  fornecimento: 'mono',
  gd2: 100,
  fioB: 45,
  icms: 'fiob_tusd',
  pisconfins: 'fiob_tusd_te',
  cosip: 12,
  injetado: 500,
  consumo: 500,
  cosip_rs: 0,
  pis: 0,
  confins: 0,
  bandeira: 'vermelha1'
};

export const Calculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [history, setHistory] = useLocalStorage<CalculationResult[]>('calculator-history', []);
  const { calculate, isCalculating } = useCalculations();
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);

  const handleInputChange = (field: keyof CalculatorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async () => {
    const result = await calculate(inputs);
    if (result) {
      setCurrentResult(result);
      setHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 calculations
    }
  };

  // Real-time calculation when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCalculate();
    }, 500);

    return () => clearTimeout(timer);
  }, [inputs]);

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleLoadHistory = (result: CalculationResult) => {
    setInputs(result.inputs);
    setCurrentResult(result);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Calculadora de Geração Distribuída
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calculator">Calculadora</TabsTrigger>
              <TabsTrigger value="results">Resultados</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator" className="space-y-6">
              <CalculatorForm
                inputs={inputs}
                onInputChange={handleInputChange}
                onCalculate={handleCalculate}
                isCalculating={isCalculating}
              />
            </TabsContent>
            
            <TabsContent value="results">
              <ResultsDisplay
                result={currentResult}
                inputs={inputs}
              />
            </TabsContent>
            
            <TabsContent value="history">
              <HistoryPanel
                history={history}
                onDelete={handleDeleteHistory}
                onLoad={handleLoadHistory}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

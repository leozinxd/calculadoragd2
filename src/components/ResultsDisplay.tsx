
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, TrendingUp, Calculator } from 'lucide-react';
import { CalculationResult, CalculatorInputs } from '@/types/calculator';
import { ResultsChart } from '@/components/ResultsChart';
import { exportToPDF } from '@/utils/exportUtils';

interface ResultsDisplayProps {
  result: CalculationResult | null;
  inputs: CalculatorInputs;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, inputs }) => {
  if (!result) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calculator className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">
            Nenhum cálculo realizado
          </h3>
          <p className="text-gray-400 text-center">
            Preencha os campos na aba "Calculadora" para ver os resultados aqui.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleExportPDF = () => {
    exportToPDF(result, inputs);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const economiaAnual = result.results.economiaTotal * 12;
  const economia25Anos = economiaAnual * 25;

  return (
    <div className="space-y-6">
      {/* Resumo Principal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Economia Mensal Estimada
            </CardTitle>
            <Button onClick={handleExportPDF} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(result.results.economiaTotal)}
              </div>
              <div className="text-sm text-gray-500">Economia Mensal</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatCurrency(economiaAnual)}
              </div>
              <div className="text-sm text-gray-500">Economia Anual</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatCurrency(economia25Anos)}
              </div>
              <div className="text-sm text-gray-500">Economia em 25 anos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição da Economia</CardTitle>
        </CardHeader>
        <CardContent>
          <ResultsChart result={result} />
        </CardContent>
      </Card>

      {/* Detalhamento */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento dos Cálculos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.results.detalhes.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <div className="font-medium">{item.item}</div>
                  <div className="text-sm text-gray-500">{item.descricao}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(item.valor)}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {((item.valor / result.results.economiaTotal) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between py-3 font-bold text-lg">
              <div>Total</div>
              <div className="text-green-600">
                {formatCurrency(result.results.economiaTotal)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cálculo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Data do Cálculo:</strong> {result.timestamp.toLocaleString('pt-BR')}
            </div>
            <div>
              <strong>Energia Injetada:</strong> {inputs.injetado} kWh
            </div>
            <div>
              <strong>Consumo:</strong> {inputs.consumo} kWh
            </div>
            <div>
              <strong>Energia Compensada:</strong> {Math.min(inputs.injetado, inputs.consumo)} kWh
            </div>
            <div>
              <strong>Fio B:</strong> {inputs.fioB}%
            </div>
            <div>
              <strong>Bandeira:</strong> {inputs.bandeira}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, RotateCcw, Calendar, TrendingUp } from 'lucide-react';
import { CalculationResult } from '@/types/calculator';

interface HistoryPanelProps {
  history: CalculationResult[];
  onDelete: (id: string) => void;
  onLoad: (result: CalculationResult) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onDelete,
  onLoad
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">
            Nenhum histórico disponível
          </h3>
          <p className="text-gray-400 text-center">
            Seus cálculos anteriores aparecerão aqui para consulta futura.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Histórico de Cálculos</h3>
        <Badge variant="secondary">{history.length} cálculo{history.length !== 1 ? 's' : ''}</Badge>
      </div>

      <div className="grid gap-4">
        {history.map((result) => (
          <Card key={result.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Economia: {formatCurrency(result.results.economiaTotal)}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLoad(result)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Carregar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(result.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Data</div>
                  <div className="font-medium">{formatDate(result.timestamp)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Injetado</div>
                  <div className="font-medium">{result.inputs.injetado} kWh</div>
                </div>
                <div>
                  <div className="text-gray-500">Consumo</div>
                  <div className="font-medium">{result.inputs.consumo} kWh</div>
                </div>
                <div>
                  <div className="text-gray-500">Fio B</div>
                  <div className="font-medium">{result.inputs.fioB}%</div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">
                  {result.inputs.fornecimento.toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  Bandeira: {result.inputs.bandeira}
                </Badge>
                <Badge variant="outline">
                  GD II: {result.inputs.gd2}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

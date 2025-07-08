
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Calculator } from 'lucide-react';
import { CalculatorInputs } from '@/types/calculator';

interface CalculatorFormProps {
  inputs: CalculatorInputs;
  onInputChange: (field: keyof CalculatorInputs, value: any) => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  inputs,
  onInputChange,
  onCalculate,
  isCalculating
}) => {
  const handleNumberChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    onInputChange(field, numValue);
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configurações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={inputs.estado} onValueChange={(value) => onInputChange('estado', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piaui">Piauí</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="fornecimento">Tipo de Fornecimento</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tipo de conexão elétrica da unidade consumidora</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={inputs.fornecimento} onValueChange={(value) => onInputChange('fornecimento', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mono">Monofásico</SelectItem>
                  <SelectItem value="bi">Bifásico</SelectItem>
                  <SelectItem value="tri">Trifásico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="bandeira">Bandeira Tarifária</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bandeira tarifária vigente no mês</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={inputs.bandeira} onValueChange={(value) => onInputChange('bandeira', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verde">Verde</SelectItem>
                  <SelectItem value="amarela">Amarela</SelectItem>
                  <SelectItem value="vermelha1">Vermelha - Patamar 1</SelectItem>
                  <SelectItem value="vermelha2">Vermelha - Patamar 2</SelectItem>
                  <SelectItem value="preta">Preta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Geração e Consumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="injetado">Energia Injetada (kWh)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Quantidade de energia injetada na rede pela geração distribuída</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type="number"
                value={inputs.injetado}
                onChange={(e) => handleNumberChange('injetado', e.target.value)}
                placeholder="500"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="consumo">Consumo (kWh)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Consumo total de energia da unidade consumidora</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type="number"
                value={inputs.consumo}
                onChange={(e) => handleNumberChange('consumo', e.target.value)}
                placeholder="500"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="gd2">GD II (%)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentual de aplicação do marco da Geração Distribuída II</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type="number"
                value={inputs.gd2}
                onChange={(e) => handleNumberChange('gd2', e.target.value)}
                placeholder="100"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Impostos e Tarifas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="fioB">Fio B (%)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentual de cobrança do Fio B conforme cronograma</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={inputs.fioB.toString()} onValueChange={(value) => onInputChange('fioB', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">2023 - 15%</SelectItem>
                  <SelectItem value="30">2024 - 30%</SelectItem>
                  <SelectItem value="45">2025 - 45%</SelectItem>
                  <SelectItem value="60">2026 - 60%</SelectItem>
                  <SelectItem value="75">2027 - 75%</SelectItem>
                  <SelectItem value="90">2028 - 90%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icms">ICMS</Label>
              <Select value={inputs.icms} onValueChange={(value) => onInputChange('icms', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiob_tusd">Fio B + TUSD</SelectItem>
                  <SelectItem value="fiob_tusd_te">Fio B + TUSD + TE</SelectItem>
                  <SelectItem value="fiob">Apenas no Fio B</SelectItem>
                  <SelectItem value="isento">Isento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pisconfins">PIS/COFINS</Label>
              <Select value={inputs.pisconfins} onValueChange={(value) => onInputChange('pisconfins', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiob_tusd_te">Fio B + TUSD + TE</SelectItem>
                  <SelectItem value="fiob">Apenas no Fio B</SelectItem>
                  <SelectItem value="isento">Isento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="cosip">COSIP (%)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Contribuição para Custeio do Serviço de Iluminação Pública</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type="number"
                value={inputs.cosip}
                onChange={(e) => handleNumberChange('cosip', e.target.value)}
                placeholder="12"
                min="0"
                max="100"
                step="0.5"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={onCalculate}
          disabled={isCalculating}
          size="lg"
          className="px-8"
        >
          <Calculator className="h-5 w-5 mr-2" />
          {isCalculating ? 'Calculando...' : 'Calcular Economia'}
        </Button>
      </div>
    </TooltipProvider>
  );
};

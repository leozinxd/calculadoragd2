
import { useState } from 'react';
import { CalculatorInputs, CalculationResult, TarifaData } from '@/types/calculator';

// Dados simulados das tarifas (em uma aplicação real, viriam de uma API)
const tarifaData: TarifaData = {
  tusd: 0.15420, // R$/kWh
  te: 0.28750,   // R$/kWh
  bandeiraTarifaria: {
    verde: 0,
    amarela: 0.01874,
    vermelha1: 0.04169,
    vermelha2: 0.06243,
    preta: 0.08000
  }
};

export const useCalculations = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const calculate = async (inputs: CalculatorInputs): Promise<CalculationResult | null> => {
    setIsCalculating(true);
    
    try {
      // Simular delay de cálculo
      await new Promise(resolve => setTimeout(resolve, 300));

      const { injetado, consumo, fioB, gd2, cosip, bandeira } = inputs;
      
      // Valores base das tarifas
      const tusd = tarifaData.tusd;
      const te = tarifaData.te;
      const bandeiraTarifa = tarifaData.bandeiraTarifaria[bandeira];
      
      // Energia compensada (menor entre injetado e consumo)
      const energiaCompensada = Math.min(injetado, consumo);
      
      // Cálculos de economia
      const fatorFioB = fioB / 100;
      const fatorGD2 = gd2 / 100;
      
      // Economia no Fio B (TUSD)
      const economiaFioB = energiaCompensada * tusd * fatorFioB * fatorGD2;
      
      // Economia na TE (Tarifa de Energia)
      const economiaTE = energiaCompensada * (te + bandeiraTarifa) * fatorGD2;
      
      // Economia na TUSD (restante)
      const economiaTUSD = energiaCompensada * tusd * (1 - fatorFioB) * fatorGD2;
      
      // Economia ICMS
      let economiaICMS = 0;
      if (inputs.icms !== 'isento') {
        const baseICMS = inputs.icms === 'fiob' ? economiaFioB :
                        inputs.icms === 'fiob_tusd' ? economiaFioB + economiaTUSD :
                        economiaFioB + economiaTUSD + economiaTE;
        economiaICMS = baseICMS * 0.25; // 25% de ICMS
      }
      
      // Economia PIS/COFINS
      let economiaPISCOFINS = 0;
      if (inputs.pisconfins !== 'isento') {
        const basePISCOFINS = inputs.pisconfins === 'fiob' ? economiaFioB :
                             economiaFioB + economiaTUSD + economiaTE;
        economiaPISCOFINS = basePISCOFINS * 0.0925; // 9.25% PIS/COFINS
      }
      
      // Economia COSIP
      const economiaCOSIP = inputs.cosip_rs > 0 ? 
        Math.min(inputs.cosip_rs, energiaCompensada * 0.05) :
        energiaCompensada * (cosip / 100) * 0.05;
      
      // Total de economia
      const economiaTotal = economiaFioB + economiaTE + economiaTUSD + 
                           economiaICMS + economiaPISCOFINS + economiaCOSIP;

      const result: CalculationResult = {
        id: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        inputs,
        results: {
          economiaTotal,
          economiaFioB,
          economiaTUSD,
          economiaTE,
          economiaICMS,
          economiaPISCOFINS,
          economiaCOSIP,
          detalhes: [
            {
              item: 'Fio B (TUSD)',
              valor: economiaFioB,
              descricao: `${energiaCompensada.toFixed(2)} kWh × R$ ${tusd.toFixed(5)} × ${fioB}%`
            },
            {
              item: 'TUSD (restante)',
              valor: economiaTUSD,
              descricao: `${energiaCompensada.toFixed(2)} kWh × R$ ${tusd.toFixed(5)} × ${(100-fioB)}%`
            },
            {
              item: 'Tarifa de Energia',
              valor: economiaTE,
              descricao: `${energiaCompensada.toFixed(2)} kWh × R$ ${(te + bandeiraTarifa).toFixed(5)}`
            },
            {
              item: 'ICMS',
              valor: economiaICMS,
              descricao: inputs.icms === 'isento' ? 'Isento' : 'Sobre componentes aplicáveis'
            },
            {
              item: 'PIS/COFINS',
              valor: economiaPISCOFINS,
              descricao: inputs.pisconfins === 'isento' ? 'Isento' : '9,25% sobre componentes aplicáveis'
            },
            {
              item: 'COSIP',
              valor: economiaCOSIP,
              descricao: `${cosip}% sobre iluminação pública`
            }
          ]
        }
      };

      return result;
    } catch (error) {
      console.error('Erro no cálculo:', error);
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  return { calculate, isCalculating };
};

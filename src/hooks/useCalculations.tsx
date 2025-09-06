
import { useState } from 'react';
import { CalculatorInputs, CalculationResult } from '@/types/calculator';

// Dados das tarifas por estado
const getTarifaData = (estado: string, pis?: number, confins?: number) => {
  let pm: any;
  
  switch(estado) {
    case "piaui":
      pm = {
        pis: 0.012808,
        confins: 0.059068,
        icms: 0.225,
        tusd: 0.58247,
        te_b3: 0.24653,
        te_gd: 0.01197,
        fioB: 0.35465,
      };
      break;
    default:
      pm = {
        pis: 0.010984,
        confins: 0.050686,
        icms: 0.225,
        tusd: 0.58247,
        te_b3: 0.24653,
        te_gd: 0.01197,
        fioB: 0.35465,
      };
  }

  if (pis && pis > 0) {
    pm.pis = pis / 100;
  }

  if (confins && confins > 0) {
    pm.confins = confins / 100;
  }

  return pm;
};

const getBandeiraTarifa = (bandeira: string) => {
  switch(bandeira) {
    case "verde":
      return 0;
    case "amarela":
      return 1.885 / 100;
    case "vermelha1":
      return 4.463 / 100;
    case "vermelha2":
      return 7.877 / 100;
    case "preta":
      return 14 / 100;
    default:
      return 0;
  }
};

const dividir = (a: number, b: number) => {
  return b === 0 ? 0 : a / b;
};

export const useCalculations = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const calculate = async (inputs: CalculatorInputs): Promise<CalculationResult | null> => {
    setIsCalculating(true);
    
    try {
      // Simular delay de cálculo
      await new Promise(resolve => setTimeout(resolve, 300));

      const { estado, fornecimento, gd2, fioB, icms, pisconfins, cosip, injetado, consumo, cosip_rs, pis, confins, bandeira } = inputs;
      
      // Obter dados das tarifas baseado no estado
      const pm = getTarifaData(estado, pis, confins);
      
      const tarifas: any = {
        normal: pm.tusd + pm.te_b3,
        gd: pm.tusd + pm.te_gd,
      };

      tarifas.fioB = Math.floor((pm.fioB * fioB / 100) * 1000000) / 1000000;

      // Definir disponibilidade por tipo de fornecimento
      let disponibilidade_kwh: number;
      if (fornecimento === "mono") {
        disponibilidade_kwh = 30;
      } else if (fornecimento === "bi") {
        disponibilidade_kwh = 50;
      } else if (fornecimento === "tri") {
        disponibilidade_kwh = 100;
      } else {
        disponibilidade_kwh = 30;
      }

      // Cálculo de compensação baseado na lógica PHP
      let res: number;
      if (injetado >= consumo) {
        res = consumo * (1 - gd2 / 100);
      } else {
        res = injetado * (1 - gd2 / 100);
      }

      const consumoConsiderado = consumo - res;
      const geracaoConsiderado = injetado - res;

      const regraCompensacao = (consumoConsiderado - disponibilidade_kwh) * tarifas.normal / (tarifas.normal - (pm.fioB * fioB / 100));

      if (regraCompensacao > consumoConsiderado) {
        res = consumoConsiderado;
      } else {
        res = regraCompensacao;
      }

      let energiaCompensada: number;
      if (res > 0) {
        energiaCompensada = res;
      } else {
        energiaCompensada = 0;
      }

      let fioB_value: number;
      if (energiaCompensada > geracaoConsiderado) {
        fioB_value = geracaoConsiderado;
      } else {
        fioB_value = energiaCompensada;
      }

      const icmsTUSD = pm.tusd / (pm.tusd + pm.te_gd);

      const base: any = {};

      // Cálculos PIS/COFINS
      base.pisconfins_gd2 = (fioB_value * tarifas.gd) / (1 - pm.pis - pm.confins);
      base.pisconfins_fioB = (fioB_value * tarifas.fioB) / (1 - pm.pis - pm.confins);

      const pis_gd2 = Number((base.pisconfins_gd2 * pm.pis).toFixed(2));

      let pis_fioB: number;
      if (pisconfins === "fiob_tusd_te" || pisconfins === "fiob") {
        pis_fioB = Number((base.pisconfins_fioB * pm.pis).toFixed(2));
      } else {
        pis_fioB = 0;
      }

      let pis_diferenca: number;
      if (pisconfins === "fiob_tusd_te") {
        pis_diferenca = pis_gd2 - pis_fioB;
      } else {
        pis_diferenca = 0;
      }

      const confins_gd2 = Number((base.pisconfins_gd2 * pm.confins).toFixed(2));

      let confins_fioB: number;
      if (pisconfins === "fiob_tusd_te" || pisconfins === "fiob") {
        confins_fioB = Number((base.pisconfins_fioB * pm.confins).toFixed(2));
      } else {
        confins_fioB = 0;
      }

      let confins_diferenca: number;
      if (pisconfins === "fiob_tusd_te") {
        confins_diferenca = confins_gd2 - confins_fioB;
      } else {
        confins_diferenca = 0;
      }

      // Cálculos ICMS
      let base_icms_gd2: number;
      if (icms === "fiob_tusd_te") {
        base_icms_gd2 = ((fioB_value * tarifas.gd) + pis_gd2 + confins_gd2) / (1 - pm.icms);
      } else {
        base_icms_gd2 = (icmsTUSD * ((fioB_value * tarifas.gd) + pis_gd2 + confins_gd2)) / (1 - pm.icms);
      }

      const base_icms_fioB = (icmsTUSD * ((fioB_value * tarifas.fioB) + pis_fioB + confins_fioB)) / (1 - pm.icms);

      const icms_gd2 = Number((base_icms_gd2 * pm.icms).toFixed(2));

      let icms_fioB: number;
      if (icms === "fiob_tusd_te" || icms === "fiob_tusd" || icms === "fiob") {
        icms_fioB = Number((base_icms_fioB * pm.icms).toFixed(2));
      } else {
        icms_fioB = 0;
      }

      let icms_diferenca: number;
      if (icms === "fiob_tusd_te" || icms === "fiob_tusd") {
        icms_diferenca = icms_gd2 - icms_fioB;
      } else {
        icms_diferenca = 0;
      }

      // Cálculo do consumo faturado
      let consumoFaturado: number;
      if (energiaCompensada === 0) {
        consumoFaturado = disponibilidade_kwh;
      } else {
        if (fioB_value < consumoConsiderado) {
          consumoFaturado = consumoConsiderado - fioB_value;
        } else {
          consumoFaturado = 0;
        }
      }

      consumoFaturado = Math.floor(consumoFaturado * 100) / 100;

      // Bandeira tarifária
      const tarifaBandeira = getBandeiraTarifa(bandeira);
      
      let quantidadeBandeira: number;
      if (consumoFaturado < disponibilidade_kwh) {
        quantidadeBandeira = disponibilidade_kwh;
      } else {
        quantidadeBandeira = consumoFaturado;
      }

      const bandeiraTarifaria = tarifaBandeira * quantidadeBandeira;

      // COSIP
      let cosipValue: number;
      if (cosip_rs > 0) {
        cosipValue = cosip_rs;
      } else {
        cosipValue = Math.floor((Math.floor((tarifas.normal * consumo) * 100) / 100) * cosip) / 100;
      }

      // Cálculo do Fio B total
      const consumoFioB = Math.floor((fioB_value * tarifas.fioB) * 100) / 100;
      const fioBTotal = consumoFioB + icms_fioB + pis_fioB + confins_fioB;
      const diferencaImpostos = icms_diferenca + pis_diferenca + confins_diferenca;

      // Benefício líquido e bruto
      const tarifaBeneficiada = Math.floor((tarifas.gd - tarifas.fioB) * 1000000) / 1000000;
      const beneficioLiquido = Math.floor(fioB_value * tarifaBeneficiada * 100) / 100;
      const beneficioBruto = beneficioLiquido + icms_diferenca + pis_diferenca + confins_diferenca;

      // Total de economia (benefício bruto + diferença de impostos)
      const economiaTotal = beneficioBruto;

      const result: CalculationResult = {
        id: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        inputs,
        results: {
          economiaTotal,
          economiaFioB: fioBTotal,
          economiaTUSD: icms_diferenca,
          economiaTE: beneficioLiquido,
          economiaICMS: icms_fioB + icms_diferenca,
          economiaPISCOFINS: pis_fioB + confins_fioB + pis_diferenca + confins_diferenca,
          economiaCOSIP: cosipValue,
          detalhes: [
            {
              item: 'Fio B Total',
              valor: fioBTotal,
              descricao: `${fioB_value.toFixed(2)} kWh × R$ ${tarifas.fioB.toFixed(5)} + impostos`
            },
            {
              item: 'Diferença ICMS',
              valor: icms_diferenca,
              descricao: `Diferença de ICMS entre GD e Fio B`
            },
            {
              item: 'Benefício Líquido',
              valor: beneficioLiquido,
              descricao: `${fioB_value.toFixed(2)} kWh × R$ ${tarifaBeneficiada.toFixed(5)}`
            },
            {
              item: 'ICMS Total',
              valor: icms_fioB + icms_diferenca,
              descricao: inputs.icms === 'isento' ? 'Isento' : 'ICMS sobre componentes aplicáveis'
            },
            {
              item: 'PIS/COFINS Total',
              valor: pis_fioB + confins_fioB + pis_diferenca + confins_diferenca,
              descricao: inputs.pisconfins === 'isento' ? 'Isento' : 'PIS/COFINS sobre componentes aplicáveis'
            },
            {
              item: 'COSIP',
              valor: cosipValue,
              descricao: cosip_rs > 0 ? `R$ ${cosip_rs.toFixed(2)}` : `${cosip}% sobre consumo total`
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

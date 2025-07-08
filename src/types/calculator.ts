
export interface CalculatorInputs {
  estado: string;
  fornecimento: 'mono' | 'tri' | 'bi';
  gd2: number;
  fioB: number;
  icms: 'fiob_tusd' | 'fiob_tusd_te' | 'fiob' | 'isento';
  pisconfins: 'fiob_tusd_te' | 'fiob' | 'isento';
  cosip: number;
  injetado: number;
  consumo: number;
  cosip_rs: number;
  pis: number;
  confins: number;
  bandeira: 'verde' | 'amarela' | 'vermelha1' | 'vermelha2' | 'preta';
}

export interface CalculationResult {
  id: string;
  timestamp: Date;
  inputs: CalculatorInputs;
  results: {
    economiaTotal: number;
    economiaFioB: number;
    economiaTUSD: number;
    economiaTE: number;
    economiaICMS: number;
    economiaPISCOFINS: number;
    economiaCOSIP: number;
    detalhes: Array<{
      item: string;
      valor: number;
      descricao: string;
    }>;
  };
}

export interface TarifaData {
  tusd: number;
  te: number;
  bandeiraTarifaria: {
    verde: number;
    amarela: number;
    vermelha1: number;
    vermelha2: number;
    preta: number;
  };
}

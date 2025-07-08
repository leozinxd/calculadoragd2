
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CalculationResult, CalculatorInputs } from '@/types/calculator';

export const exportToPDF = async (result: CalculationResult, inputs: CalculatorInputs) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Função auxiliar para adicionar texto
  const addText = (text: string, fontSize = 12, isBold = false) => {
    if (isBold) {
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    pdf.setFontSize(fontSize);
    pdf.text(text, margin, yPosition);
    yPosition += fontSize * 0.5 + 5;
  };

  // Função auxiliar para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Cabeçalho
  addText('RELATÓRIO DE CÁLCULO - GERAÇÃO DISTRIBUÍDA', 16, true);
  addText('Estado do Piauí', 12);
  yPosition += 10;

  // Informações do cálculo
  addText('DADOS DO CÁLCULO', 14, true);
  addText(`Data: ${result.timestamp.toLocaleString('pt-BR')}`);
  addText(`Tipo de Fornecimento: ${inputs.fornecimento.toUpperCase()}`);
  addText(`Energia Injetada: ${inputs.injetado} kWh`);
  addText(`Consumo: ${inputs.consumo} kWh`);
  addText(`Energia Compensada: ${Math.min(inputs.injetado, inputs.consumo)} kWh`);
  addText(`Fio B: ${inputs.fioB}%`);
  addText(`GD II: ${inputs.gd2}%`);
  addText(`Bandeira Tarifária: ${inputs.bandeira}`);
  yPosition += 10;

  // Resultados
  addText('RESULTADOS DA ECONOMIA', 14, true);
  addText(`Economia Mensal: ${formatCurrency(result.results.economiaTotal)}`, 12, true);
  addText(`Economia Anual: ${formatCurrency(result.results.economiaTotal * 12)}`, 12, true);
  addText(`Economia em 25 anos: ${formatCurrency(result.results.economiaTotal * 12 * 25)}`, 12, true);
  yPosition += 10;

  // Detalhamento
  addText('DETALHAMENTO POR COMPONENTE', 14, true);
  result.results.detalhes.forEach(item => {
    if (item.valor > 0) {
      addText(`${item.item}: ${formatCurrency(item.valor)}`);
      addText(`  ${item.descricao}`, 10);
    }
  });

  yPosition += 10;
  addText('OBSERVAÇÕES', 14, true);
  addText('• Valores calculados com base nas tarifas vigentes no Piauí', 10);
  addText('• Cálculo considera as regras do Marco da Geração Distribuída', 10);
  addText('• Economia real pode variar conforme condições específicas', 10);
  addText('• Consulte sempre a distribuidora para valores precisos', 10);

  // Rodapé
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.setFontSize(8);
  pdf.text('Relatório gerado pela Calculadora GD - Piauí', margin, pageHeight - 10);

  // Salvar PDF
  const fileName = `calculo-gd-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};

export const exportToCSV = (history: CalculationResult[]) => {
  const headers = [
    'Data',
    'Injetado (kWh)',
    'Consumo (kWh)',
    'Fio B (%)',
    'GD II (%)',
    'Bandeira',
    'Economia Total (R$)',
    'Economia Anual (R$)'
  ];

  const csvContent = [
    headers.join(','),
    ...history.map(result => [
      result.timestamp.toLocaleDateString('pt-BR'),
      result.inputs.injetado,
      result.inputs.consumo,
      result.inputs.fioB,
      result.inputs.gd2,
      result.inputs.bandeira,
      result.results.economiaTotal.toFixed(2),
      (result.results.economiaTotal * 12).toFixed(2)
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `historico-calculadora-gd-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

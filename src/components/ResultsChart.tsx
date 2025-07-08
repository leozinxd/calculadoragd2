
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CalculationResult } from '@/types/calculator';

interface ResultsChartProps {
  result: CalculationResult;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const ResultsChart: React.FC<ResultsChartProps> = ({ result }) => {
  const pieData = result.results.detalhes
    .filter(item => item.valor > 0)
    .map((item, index) => ({
      name: item.item,
      value: item.valor,
      color: COLORS[index % COLORS.length]
    }));

  const barData = result.results.detalhes
    .filter(item => item.valor > 0)
    .map(item => ({
      name: item.item.replace(' (', '\n('),
      valor: item.valor
    }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-blue-600">
            Valor: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-500">
            {((payload[0].value / result.results.economiaTotal) * 100).toFixed(1)}% do total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Pizza */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-center">Distribuição por Componente</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Barras */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-center">Valores por Componente</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
              fontSize={12}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Economia']}
              labelFormatter={(label) => `Componente: ${label}`}
            />
            <Bar dataKey="valor" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

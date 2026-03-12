'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { TrendingDown, Clock, Percent } from 'lucide-react';

interface Props {
  ahorroAnualMax: number;
  roiPorcentaje: number | null;
  paybackMeses: number | null;
  porcentajeAhorroMax: number;
}

export function SavingsCards({ ahorroAnualMax, roiPorcentaje, paybackMeses, porcentajeAhorroMax }: Props) {
  const isRoiAvailable = roiPorcentaje !== null;
  const cards = [
    {
      label: 'Ahorro Anual',
      value: formatCurrency(Math.max(0, ahorroAnualMax)),
      icon: TrendingDown,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    {
      label: isRoiAvailable ? 'Retorno de Inversión' : 'Ahorro en Costos',
      value: isRoiAvailable
        ? `${Math.max(0, roiPorcentaje).toFixed(0)}%`
        : `${Math.max(0, porcentajeAhorroMax).toFixed(0)}%`,
      icon: Percent,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      note: !isRoiAvailable ? 'Porcentaje de ahorro vs método tradicional' : undefined,
    },
    {
      label: 'Período de Recuperación',
      value: paybackMeses !== null && isFinite(paybackMeses)
        ? `${Math.ceil(paybackMeses)} meses`
        : 'N/A',
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      note: paybackMeses === null ? 'Solo aplica en modo compra' : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className={cn('border', c.border)}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{c.label}</p>
                <p className={cn('text-2xl font-bold mt-1', c.color)}>{c.value}</p>
                {c.note && <p className="text-xs text-gray-400 mt-1">{c.note}</p>}
              </div>
              <div className={cn('rounded-lg p-2', c.bg)}>
                <c.icon className={cn('h-5 w-5', c.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

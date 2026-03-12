'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { MethodCostBreakdown } from '@/lib/calculations/types';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

interface Props {
  manual: MethodCostBreakdown | null;
  tractor: MethodCostBreakdown | null;
  drone: MethodCostBreakdown;
}

export function ComparisonChart({ manual, tractor, drone }: Props) {
  const categories = [
    { key: 'manoDeObra', label: 'Mano de Obra' },
    { key: 'insumos', label: 'Insumos' },
    { key: 'equipo', label: 'Equipo/Servicio' },
    { key: 'combustible', label: 'Combustible' },
    { key: 'dañoCultivo', label: 'Daño Cultivo' },
  ] as const;

  type BreakdownKey = (typeof categories)[number]['key'];

  const data = categories.map((cat) => {
    const row: Record<string, string | number> = { name: cat.label };
    if (manual) row['Manual'] = Math.round(manual[cat.key as BreakdownKey]);
    if (tractor) row['Tractor'] = Math.round(tractor[cat.key as BreakdownKey]);
    row['Drone'] = Math.round(drone[cat.key as BreakdownKey]);
    return row;
  });

  // Total bar
  const totalRow: Record<string, string | number> = { name: 'TOTAL' };
  if (manual) totalRow['Manual'] = Math.round(manual.total);
  if (tractor) totalRow['Tractor'] = Math.round(tractor.total);
  totalRow['Drone'] = Math.round(drone.total);
  data.push(totalRow);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de Costos Anuales</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickFormatter={(v: number) => formatCurrency(v)}
              fontSize={12}
            />
            <YAxis type="category" dataKey="name" width={110} fontSize={12} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Legend />
            {manual && <Bar dataKey="Manual" fill="#ef4444" radius={[0, 4, 4, 0]} />}
            {tractor && <Bar dataKey="Tractor" fill="#f59e0b" radius={[0, 4, 4, 0]} />}
            <Bar dataKey="Drone" fill="#22c55e" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

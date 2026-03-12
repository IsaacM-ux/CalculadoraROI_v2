'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { ProjectionYear } from '@/lib/calculations/types';
import { formatCurrency } from '@/lib/utils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

interface Props {
  projection: ProjectionYear[];
  includeManual: boolean;
  includeTractor: boolean;
}

export function ProjectionChart({ projection, includeManual, includeTractor }: Props) {
  const data = projection.map((p) => ({
    name: `Año ${p.year}`,
    ...(includeManual ? { Manual: Math.round(p.costoAcumuladoManual) } : {}),
    ...(includeTractor ? { Tractor: Math.round(p.costoAcumuladoTractor) } : {}),
    Drone: Math.round(p.costoAcumuladoDrone),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyección de Costos a 5 Años</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis tickFormatter={(v: number) => formatCurrency(v)} fontSize={12} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Legend />
            {includeManual && (
              <Line type="monotone" dataKey="Manual" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            )}
            {includeTractor && (
              <Line type="monotone" dataKey="Tractor" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            )}
            <Line type="monotone" dataKey="Drone" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

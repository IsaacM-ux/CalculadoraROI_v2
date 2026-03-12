'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { MethodCostBreakdown } from '@/lib/calculations/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface Props {
  manual: MethodCostBreakdown | null;
  tractor: MethodCostBreakdown | null;
  drone: MethodCostBreakdown;
}

export function MethodComparisonTable({ manual, tractor, drone }: Props) {
  const rows = [
    {
      label: 'Costo Total Anual',
      manual: manual ? formatCurrency(manual.total) : '—',
      tractor: tractor ? formatCurrency(tractor.total) : '—',
      drone: formatCurrency(drone.total),
    },
    {
      label: 'Costo por Hectárea',
      manual: manual ? formatCurrency(manual.costoPorHectarea) : '—',
      tractor: tractor ? formatCurrency(tractor.costoPorHectarea) : '—',
      drone: formatCurrency(drone.costoPorHectarea),
    },
    {
      label: 'Mano de Obra',
      manual: manual ? formatCurrency(manual.manoDeObra) : '—',
      tractor: tractor ? formatCurrency(tractor.manoDeObra) : '—',
      drone: formatCurrency(drone.manoDeObra),
    },
    {
      label: 'Insumos',
      manual: manual ? formatCurrency(manual.insumos) : '—',
      tractor: tractor ? formatCurrency(tractor.insumos) : '—',
      drone: formatCurrency(drone.insumos),
    },
    {
      label: 'Equipo/Servicio',
      manual: manual ? formatCurrency(manual.equipo) : '—',
      tractor: tractor ? formatCurrency(tractor.equipo) : '—',
      drone: formatCurrency(drone.equipo),
    },
    {
      label: 'Combustible',
      manual: '—',
      tractor: tractor ? formatCurrency(tractor.combustible) : '—',
      drone: '$0',
    },
    {
      label: 'Daño al Cultivo',
      manual: '$0',
      tractor: tractor ? formatCurrency(tractor.dañoCultivo) : '—',
      drone: '$0',
    },
    {
      label: 'Tiempo Total (días)',
      manual: manual ? formatNumber(manual.tiempoDias) : '—',
      tractor: tractor ? formatNumber(tractor.tiempoDias) : '—',
      drone: drone.tiempoDias > 0 ? formatNumber(drone.tiempoDias) : 'Incluido en servicio',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabla Comparativa Detallada</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-500">Concepto</th>
                {manual && (
                  <th className="text-right py-3 px-2 font-medium text-red-600">Manual</th>
                )}
                {tractor && (
                  <th className="text-right py-3 px-2 font-medium text-amber-600">Tractor</th>
                )}
                <th className="text-right py-3 px-2 font-medium text-green-600">Drone</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i === 0 ? 'bg-gray-50 font-semibold border-b' : 'border-b border-gray-100'}
                >
                  <td className="py-2.5 px-2 text-gray-700">{row.label}</td>
                  {manual && <td className="py-2.5 px-2 text-right text-gray-900">{row.manual}</td>}
                  {tractor && <td className="py-2.5 px-2 text-right text-gray-900">{row.tractor}</td>}
                  <td className="py-2.5 px-2 text-right text-green-700 font-medium">{row.drone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

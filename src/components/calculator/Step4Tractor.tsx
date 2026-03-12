'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { TractorCostInputs } from '@/lib/calculations/types';

interface Props {
  tractor: TractorCostInputs;
  included: boolean;
  onIncludedChange: (v: boolean) => void;
  onChange: (field: string, value: number | boolean) => void;
}

export function Step4Tractor({ tractor, included, onIncludedChange, onChange }: Props) {
  const numChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) onChange(field, v);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Método Tractor (Pulverizadora)</h2>
        <p className="text-sm text-gray-500 mt-1">
          Costos de fumigación/aplicación con tractor y pulverizadora terrestre
        </p>
      </div>

      <Checkbox
        label="Incluir tractor en la comparación"
        checked={included}
        onChange={onIncludedChange}
      />

      {included && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Costo operador/día"
              type="number"
              min={1}
              value={tractor.costoOperadorDia}
              onChange={numChange('costoOperadorDia')}
              suffix="$/día"
            />
            <Input
              label="Rendimiento"
              type="number"
              min={1}
              value={tractor.rendimientoHaDia}
              onChange={numChange('rendimientoHaDia')}
              suffix="ha/día"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Consumo combustible"
              type="number"
              min={0.1}
              step={0.1}
              value={tractor.consumoCombustibleHa}
              onChange={numChange('consumoCombustibleHa')}
              suffix="L/ha"
            />
            <Input
              label="Precio combustible"
              type="number"
              min={0.1}
              step={0.1}
              value={tractor.precioCombustible}
              onChange={numChange('precioCombustible')}
              suffix="$/L"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={tractor.esRentado ? 'Renta anual del equipo' : 'Costo del equipo (compra)'}
              type="number"
              min={1}
              value={tractor.costoEquipoTotal}
              onChange={numChange('costoEquipoTotal')}
              suffix="$"
            />
            {!tractor.esRentado && (
              <Input
                label="Vida útil del equipo"
                type="number"
                min={1}
                max={20}
                value={tractor.vidaUtilAnios}
                onChange={numChange('vidaUtilAnios')}
                suffix="años"
              />
            )}
          </div>

          <Checkbox
            label="El equipo es rentado (no propio)"
            checked={tractor.esRentado}
            onChange={(v) => onChange('esRentado', v)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Mantenimiento anual"
              type="number"
              min={0}
              value={tractor.mantenimientoAnual}
              onChange={numChange('mantenimientoAnual')}
              suffix="$/año"
            />
            <Input
              label="Daño al cultivo (pisoteo)"
              type="number"
              min={0}
              max={100}
              value={tractor.porcentajeDañoCultivo}
              onChange={numChange('porcentajeDañoCultivo')}
              suffix="%"
            />
            <Input
              label="Desperdicio de insumos"
              type="number"
              min={0}
              max={100}
              value={tractor.porcentajeDesperdicio}
              onChange={numChange('porcentajeDesperdicio')}
              suffix="%"
            />
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { ManualCostInputs } from '@/lib/calculations/types';

interface Props {
  manual: ManualCostInputs;
  included: boolean;
  onIncludedChange: (v: boolean) => void;
  onChange: (field: string, value: number) => void;
}

export function Step3Manual({ manual, included, onIncludedChange, onChange }: Props) {
  const numChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) onChange(field, v);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Método Manual (Bomba de Espalda)</h2>
        <p className="text-sm text-gray-500 mt-1">
          Costos del método manual de fumigación/aplicación con jornaleros
        </p>
      </div>

      <Checkbox
        label="Incluir método manual en la comparación"
        checked={included}
        onChange={onIncludedChange}
      />

      {included && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Costo por jornal"
              type="number"
              min={1}
              value={manual.costoJornal}
              onChange={numChange('costoJornal')}
              suffix="$/día"
            />
            <Input
              label="Rendimiento por jornalero"
              type="number"
              min={0.1}
              step={0.1}
              value={manual.rendimientoHaDia}
              onChange={numChange('rendimientoHaDia')}
              suffix="ha/día"
            />
          </div>
          <Input
            label="Desperdicio de insumos"
            type="number"
            min={0}
            max={100}
            value={manual.porcentajeDesperdicio}
            onChange={numChange('porcentajeDesperdicio')}
            suffix="%"
          />
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            <strong>Nota:</strong> El método manual implica mayor exposición del operador a agroquímicos
            y menor uniformidad de aplicación, lo que puede resultar en re-aplicaciones.
          </div>
        </div>
      )}
    </div>
  );
}

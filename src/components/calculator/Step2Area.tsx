'use client';

import { Input } from '@/components/ui/input';
import type { CommonInputs } from '@/lib/calculations/types';

interface Props {
  common: CommonInputs;
  onChange: (field: string, value: number) => void;
}

export function Step2Area({ common, onChange }: Props) {
  const numChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) onChange(field, v);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Superficie y Aplicaciones</h2>
        <p className="text-sm text-gray-500 mt-1">Área total y frecuencia de aplicaciones por año</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Superficie total"
          type="number"
          min={1}
          value={common.hectareas}
          onChange={numChange('hectareas')}
          suffix="ha"
        />
        <Input
          label="Aplicaciones por año"
          type="number"
          min={1}
          max={30}
          value={common.aplicacionesAnio}
          onChange={numChange('aplicacionesAnio')}
          suffix="veces"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Dosis de insumo por ha"
          type="number"
          min={0.1}
          step={0.1}
          value={common.dosisInsumosLHa}
          onChange={numChange('dosisInsumosLHa')}
          suffix="L/ha"
        />
        <Input
          label="Precio del insumo"
          type="number"
          min={0.1}
          step={0.1}
          value={common.precioInsumoLitro}
          onChange={numChange('precioInsumoLitro')}
          suffix="$/L"
        />
      </div>

      {common.serviceType === 'seeding' && (
        <Input
          label="Costo de semilla por ha"
          type="number"
          min={0}
          value={common.costoSemillaHa}
          onChange={numChange('costoSemillaHa')}
          suffix="$/ha"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Rendimiento del cultivo"
          type="number"
          min={0.1}
          step={0.1}
          value={common.rendimientoCultivoTonHa}
          onChange={numChange('rendimientoCultivoTonHa')}
          suffix="ton/ha"
        />
        <Input
          label="Precio de venta"
          type="number"
          min={1}
          value={common.precioTonelada}
          onChange={numChange('precioTonelada')}
          suffix="$/ton"
        />
      </div>
    </div>
  );
}

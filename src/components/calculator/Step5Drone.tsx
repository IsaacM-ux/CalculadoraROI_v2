'use client';

import { Input } from '@/components/ui/input';
import { ToggleGroup } from '@/components/ui/toggle-group';
import type { DronePurchaseInputs, DroneDaaSInputs, DroneModel } from '@/lib/calculations/types';
import { ShoppingCart, Handshake } from 'lucide-react';

interface Props {
  model: DroneModel;
  purchase: DronePurchaseInputs;
  daas: DroneDaaSInputs;
  onModelChange: (model: DroneModel) => void;
  onPurchaseChange: (field: string, value: number) => void;
  onDaaSChange: (field: string, value: number) => void;
}

export function Step5Drone({ model, purchase, daas, onModelChange, onPurchaseChange, onDaaSChange }: Props) {
  const numPurchase = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) onPurchaseChange(field, v);
  };

  const numDaaS = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) onDaaSChange(field, v);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Configuración del Drone</h2>
        <p className="text-sm text-gray-500 mt-1">
          Elige entre comprar el drone o contratar el servicio por hectárea (DaaS)
        </p>
      </div>

      <ToggleGroup
        label="Modelo de negocio"
        value={model}
        onChange={(v) => onModelChange(v as DroneModel)}
        options={[
          { value: 'purchase', label: 'Compra', icon: <ShoppingCart className="h-4 w-4" /> },
          { value: 'daas', label: 'Servicio (DaaS)', icon: <Handshake className="h-4 w-4" /> },
        ]}
      />

      {model === 'purchase' ? (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Precio del drone"
              type="number"
              min={1000}
              value={purchase.precioDrone}
              onChange={numPurchase('precioDrone')}
              suffix="$"
            />
            <Input
              label="Vida útil"
              type="number"
              min={1}
              max={10}
              value={purchase.vidaUtilAnios}
              onChange={numPurchase('vidaUtilAnios')}
              suffix="años"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mantenimiento anual"
              type="number"
              min={0}
              value={purchase.mantenimientoAnual}
              onChange={numPurchase('mantenimientoAnual')}
              suffix="$/año"
            />
            <Input
              label="Baterías (reemplazo anual)"
              type="number"
              min={0}
              value={purchase.costoBateriasAnual}
              onChange={numPurchase('costoBateriasAnual')}
              suffix="$/año"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Costo operador/piloto"
              type="number"
              min={1}
              value={purchase.costoOperadorDia}
              onChange={numPurchase('costoOperadorDia')}
              suffix="$/día"
            />
            <Input
              label="Rendimiento del drone"
              type="number"
              min={1}
              value={purchase.rendimientoHaDia}
              onChange={numPurchase('rendimientoHaDia')}
              suffix="ha/día"
            />
          </div>
          <Input
            label="Reducción de insumos (precisión)"
            type="number"
            min={0}
            max={100}
            value={purchase.porcentajeReduccionInsumos}
            onChange={numPurchase('porcentajeReduccionInsumos')}
            suffix="%"
          />
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in">
          <Input
            label="Costo del servicio por hectárea"
            type="number"
            min={1}
            value={daas.costoPorHa}
            onChange={numDaaS('costoPorHa')}
            suffix="$/ha"
          />
          <Input
            label="Reducción de insumos (precisión)"
            type="number"
            min={0}
            max={100}
            value={daas.porcentajeReduccionInsumos}
            onChange={numDaaS('porcentajeReduccionInsumos')}
            suffix="%"
          />
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
            <strong>Drone como Servicio (DaaS):</strong> No requiere inversión inicial.
            El proveedor se encarga del equipo, mantenimiento y operación.
            Ideal para probar la tecnología antes de invertir.
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { Select } from '@/components/ui/select';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { crops } from '@/lib/data/crops';
import type { ServiceType } from '@/lib/calculations/types';
import { Sprout, SprayCan } from 'lucide-react';

interface Props {
  serviceType: ServiceType;
  selectedCropId: string;
  onServiceChange: (v: string) => void;
  onCropChange: (v: string) => void;
}

export function Step1Service({ serviceType, selectedCropId, onServiceChange, onCropChange }: Props) {
  const cropOptions = [
    ...crops.map((c) => ({ value: c.id, label: `${c.nombre} — ${c.region}` })),
    { value: 'custom', label: 'Personalizado (entrada manual)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Servicio y Cultivo</h2>
        <p className="text-sm text-gray-500 mt-1">Selecciona el tipo de aplicación y tu cultivo principal</p>
      </div>

      <ToggleGroup
        label="Tipo de servicio"
        value={serviceType}
        onChange={onServiceChange}
        options={[
          { value: 'fumigation', label: 'Fumigación', icon: <SprayCan className="h-4 w-4" /> },
          { value: 'seeding', label: 'Siembra', icon: <Sprout className="h-4 w-4" /> },
        ]}
      />

      <Select
        label="Cultivo"
        value={selectedCropId}
        onChange={(e) => onCropChange(e.target.value)}
        options={cropOptions}
      />

      {selectedCropId !== 'custom' && (
        <p className="text-xs text-gray-400">
          Los campos se llenarán con valores de referencia para este cultivo. Puedes editarlos en los siguientes pasos.
        </p>
      )}
    </div>
  );
}

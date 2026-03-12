'use client';

import { useState, useMemo, useCallback } from 'react';
import type { UserInputs, CalculationResult, CropData } from '@/lib/calculations/types';
import { calculateROI } from '@/lib/calculations/roi-engine';
import { defaultInputs } from '@/lib/data/defaults';
import { getCropById } from '@/lib/data/crops';
import { userInputsSchema } from '@/lib/validation/schemas';

export function useCalculator() {
  const [inputs, setInputs] = useState<UserInputs>(defaultInputs);
  const [step, setStep] = useState(0);
  const [selectedCropId, setSelectedCropId] = useState<string>('soja');

  const results: CalculationResult = useMemo(() => calculateROI(inputs), [inputs]);

  const updateCommon = useCallback(
    (field: string, value: number | string) => {
      setInputs((prev) => ({
        ...prev,
        common: { ...prev.common, [field]: value },
      }));
    },
    [],
  );

  const updateManual = useCallback(
    (field: string, value: number) => {
      setInputs((prev) => ({
        ...prev,
        manual: { ...prev.manual, [field]: value },
      }));
    },
    [],
  );

  const updateTractor = useCallback(
    (field: string, value: number | boolean) => {
      setInputs((prev) => ({
        ...prev,
        tractor: { ...prev.tractor, [field]: value },
      }));
    },
    [],
  );

  const updateDronePurchase = useCallback(
    (field: string, value: number) => {
      setInputs((prev) => ({
        ...prev,
        drone: {
          ...prev.drone,
          purchase: { ...prev.drone.purchase, [field]: value },
        },
      }));
    },
    [],
  );

  const updateDroneDaaS = useCallback(
    (field: string, value: number) => {
      setInputs((prev) => ({
        ...prev,
        drone: {
          ...prev.drone,
          daas: { ...prev.drone.daas, [field]: value },
        },
      }));
    },
    [],
  );

  const setDroneModel = useCallback(
    (model: 'purchase' | 'daas') => {
      setInputs((prev) => ({
        ...prev,
        drone: { ...prev.drone, model },
      }));
    },
    [],
  );

  const setIncludeManual = useCallback(
    (v: boolean) => setInputs((prev) => ({ ...prev, includeManual: v })),
    [],
  );

  const setIncludeTractor = useCallback(
    (v: boolean) => setInputs((prev) => ({ ...prev, includeTractor: v })),
    [],
  );

  const selectCrop = useCallback(
    (cropId: string) => {
      setSelectedCropId(cropId);
      if (cropId === 'custom') return;
      const crop = getCropById(cropId);
      if (!crop) return;
      applyFromCrop(crop);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  function applyFromCrop(crop: CropData) {
    setInputs((prev) => ({
      ...prev,
      common: {
        ...prev.common,
        aplicacionesAnio: crop.aplicacionesAnio,
        dosisInsumosLHa: crop.dosisInsumosLHa,
        precioInsumoLitro: crop.precioInsumoLitro,
        costoSemillaHa: crop.costoSemillaHa,
        rendimientoCultivoTonHa: crop.rendimientoTonHa,
        precioTonelada: crop.precioTonelada,
      },
      manual: {
        ...prev.manual,
        costoJornal: crop.costoJornalDefault,
        rendimientoHaDia: crop.rendimientoManualHaDia,
      },
      tractor: {
        ...prev.tractor,
        rendimientoHaDia: crop.rendimientoTractorHaDia,
      },
      drone: {
        ...prev.drone,
        purchase: {
          ...prev.drone.purchase,
          rendimientoHaDia: crop.rendimientoDroneHaDia,
          porcentajeReduccionInsumos: crop.reduccionInsumosDrone,
        },
        daas: {
          ...prev.drone.daas,
          porcentajeReduccionInsumos: crop.reduccionInsumosDrone,
        },
      },
    }));
  }

  const totalSteps = 5;
  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  const goToStep = (s: number) => setStep(s);

  const validate = useCallback((): string[] => {
    const result = userInputsSchema.safeParse(inputs);
    if (result.success) return [];
    return result.error.issues.map((issue) => {
      const path = issue.path.join('.');
      return path ? `${path}: ${issue.message}` : issue.message;
    });
  }, [inputs]);

  return {
    inputs,
    results,
    step,
    totalSteps,
    selectedCropId,
    nextStep,
    prevStep,
    goToStep,
    selectCrop,
    updateCommon,
    updateManual,
    updateTractor,
    updateDronePurchase,
    updateDroneDaaS,
    setDroneModel,
    setIncludeManual,
    setIncludeTractor,
    validate,
  };
}

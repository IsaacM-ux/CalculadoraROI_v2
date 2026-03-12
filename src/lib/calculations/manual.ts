import type { UserInputs, MethodCostBreakdown } from './types';

/**
 * Calculate annual cost for manual spraying (backpack sprayer / bomba de espalda).
 */
export function calculateManualCost(inputs: UserInputs): MethodCostBreakdown {
  const { common, manual } = inputs;
  const { hectareas, aplicacionesAnio, dosisInsumosLHa, precioInsumoLitro } = common;
  const { costoJornal, rendimientoHaDia, porcentajeDesperdicio } = manual;

  const diasPorAplicacion = hectareas / rendimientoHaDia;
  const totalDias = diasPorAplicacion * aplicacionesAnio;

  // Labor cost
  const manoDeObra = totalDias * costoJornal;

  // Inputs cost — manual has higher waste
  const factorDesperdicio = 1 + porcentajeDesperdicio / 100;
  const insumosBase = hectareas * dosisInsumosLHa * precioInsumoLitro * aplicacionesAnio;
  const insumos = insumosBase * factorDesperdicio;
  const desperdicio = insumos - insumosBase;

  // No equipment cost for manual, no fuel, no crop damage
  const total = manoDeObra + insumos;

  return {
    manoDeObra,
    insumos,
    equipo: 0,
    combustible: 0,
    dañoCultivo: 0,
    desperdicio,
    total,
    costoPorHectarea: total / hectareas,
    tiempoDias: totalDias,
  };
}

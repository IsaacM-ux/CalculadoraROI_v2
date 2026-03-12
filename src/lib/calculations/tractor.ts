import type { UserInputs, MethodCostBreakdown } from './types';

/**
 * Calculate annual cost for tractor-based spraying.
 */
export function calculateTractorCost(inputs: UserInputs): MethodCostBreakdown {
  const { common, tractor } = inputs;
  const { hectareas, aplicacionesAnio, dosisInsumosLHa, precioInsumoLitro,
    rendimientoCultivoTonHa, precioTonelada } = common;
  const {
    costoOperadorDia, consumoCombustibleHa, precioCombustible,
    mantenimientoAnual, costoEquipoTotal, vidaUtilAnios, esRentado,
    porcentajeDañoCultivo, rendimientoHaDia, porcentajeDesperdicio,
  } = tractor;

  const diasPorAplicacion = hectareas / rendimientoHaDia;
  const totalDias = diasPorAplicacion * aplicacionesAnio;

  // Labor
  const manoDeObra = totalDias * costoOperadorDia;

  // Fuel
  const combustible = hectareas * consumoCombustibleHa * precioCombustible * aplicacionesAnio;

  // Equipment: amortization (if owned) or annual rent + maintenance
  const amortizacion = esRentado ? costoEquipoTotal : costoEquipoTotal / vidaUtilAnios;
  const equipo = amortizacion + mantenimientoAnual;

  // Inputs with waste factor
  const factorDesperdicio = 1 + porcentajeDesperdicio / 100;
  const insumosBase = hectareas * dosisInsumosLHa * precioInsumoLitro * aplicacionesAnio;
  const insumos = insumosBase * factorDesperdicio;
  const desperdicio = insumos - insumosBase;

  // Crop damage from trampling
  const produccionTotal = hectareas * rendimientoCultivoTonHa;
  const valorProduccion = produccionTotal * precioTonelada;
  const dañoCultivo = valorProduccion * (porcentajeDañoCultivo / 100);

  const total = manoDeObra + insumos + equipo + combustible + dañoCultivo;

  return {
    manoDeObra,
    insumos,
    equipo,
    combustible,
    dañoCultivo,
    desperdicio,
    total,
    costoPorHectarea: total / hectareas,
    tiempoDias: totalDias,
  };
}

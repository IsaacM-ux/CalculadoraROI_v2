import type { UserInputs, MethodCostBreakdown } from './types';

/**
 * Calculate annual cost for drone-based application (purchase or DaaS).
 */
export function calculateDroneCost(inputs: UserInputs): MethodCostBreakdown {
  const { common, drone } = inputs;
  const { hectareas, aplicacionesAnio, dosisInsumosLHa, precioInsumoLitro } = common;

  if (drone.model === 'daas') {
    return calculateDaaSCost(inputs);
  }

  return calculatePurchaseCost(inputs);
}

function calculatePurchaseCost(inputs: UserInputs): MethodCostBreakdown {
  const { common, drone } = inputs;
  const { hectareas, aplicacionesAnio, dosisInsumosLHa, precioInsumoLitro } = common;
  const {
    precioDrone, vidaUtilAnios, mantenimientoAnual, costoBateriasAnual,
    costoOperadorDia, rendimientoHaDia, porcentajeReduccionInsumos,
  } = drone.purchase;

  const diasPorAplicacion = hectareas / rendimientoHaDia;
  const totalDias = diasPorAplicacion * aplicacionesAnio;

  // Labor (drone pilot)
  const manoDeObra = totalDias * costoOperadorDia;

  // Equipment: drone amortization + maintenance + batteries
  const amortizacion = precioDrone / vidaUtilAnios;
  const equipo = amortizacion + mantenimientoAnual + costoBateriasAnual;

  // Inputs: reduced by precision application
  const factorReduccion = 1 - porcentajeReduccionInsumos / 100;
  const insumosBase = hectareas * dosisInsumosLHa * precioInsumoLitro * aplicacionesAnio;
  const insumos = insumosBase * factorReduccion;

  // Drone: minimal waste (~5% already factored into reduction), no fuel, no crop damage
  const desperdicio = 0;
  const total = manoDeObra + insumos + equipo;

  return {
    manoDeObra,
    insumos,
    equipo,
    combustible: 0,
    dañoCultivo: 0,
    desperdicio,
    total,
    costoPorHectarea: total / hectareas,
    tiempoDias: totalDias,
  };
}

function calculateDaaSCost(inputs: UserInputs): MethodCostBreakdown {
  const { common, drone } = inputs;
  const { hectareas, aplicacionesAnio, dosisInsumosLHa, precioInsumoLitro } = common;
  const { costoPorHa, porcentajeReduccionInsumos } = drone.daas;

  // Service cost covers labor + equipment
  const serviceCost = hectareas * costoPorHa * aplicacionesAnio;

  // Inputs: still paid by farmer, but reduced
  const factorReduccion = 1 - porcentajeReduccionInsumos / 100;
  const insumosBase = hectareas * dosisInsumosLHa * precioInsumoLitro * aplicacionesAnio;
  const insumos = insumosBase * factorReduccion;

  const total = serviceCost + insumos;

  return {
    manoDeObra: 0,
    insumos,
    equipo: serviceCost, // Service cost grouped as "equipo/servicio"
    combustible: 0,
    dañoCultivo: 0,
    desperdicio: 0,
    total,
    costoPorHectarea: total / hectareas,
    tiempoDias: 0, // Service provider handles timing
  };
}

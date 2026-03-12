import type { UserInputs } from '../calculations/types';

/**
 * Default user inputs used to initialize the calculator form.
 * Values match a mid-size soybean farm scenario.
 */
export const defaultInputs: UserInputs = {
  common: {
    serviceType: 'fumigation',
    hectareas: 100,
    aplicacionesAnio: 4,
    dosisInsumosLHa: 2.5,
    precioInsumoLitro: 12,
    costoSemillaHa: 60,
    rendimientoCultivoTonHa: 3.0,
    precioTonelada: 380,
  },
  manual: {
    costoJornal: 20,
    rendimientoHaDia: 1.5,
    porcentajeDesperdicio: 20,
  },
  tractor: {
    costoOperadorDia: 40,
    consumoCombustibleHa: 4,
    precioCombustible: 1.2,
    mantenimientoAnual: 1200,
    costoEquipoTotal: 25000,
    vidaUtilAnios: 10,
    esRentado: false,
    porcentajeDañoCultivo: 3,
    rendimientoHaDia: 25,
    porcentajeDesperdicio: 10,
  },
  drone: {
    model: 'purchase',
    purchase: {
      precioDrone: 20000,
      vidaUtilAnios: 5,
      mantenimientoAnual: 1000,
      costoBateriasAnual: 500,
      costoOperadorDia: 60,
      rendimientoHaDia: 50,
      porcentajeReduccionInsumos: 25,
    },
    daas: {
      costoPorHa: 12,
      porcentajeReduccionInsumos: 25,
    },
  },
  includeManual: true,
  includeTractor: true,
};

export const PROJECTION_YEARS = 5;

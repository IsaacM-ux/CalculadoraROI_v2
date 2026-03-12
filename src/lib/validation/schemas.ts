import { z } from 'zod';

const positiveNumber = z.number().positive('Debe ser mayor a 0');
const percentage = z.number().min(0).max(100);

export const commonSchema = z.object({
  serviceType: z.enum(['fumigation', 'seeding']),
  hectareas: positiveNumber,
  aplicacionesAnio: z.number().int().min(1).max(30),
  dosisInsumosLHa: positiveNumber,
  precioInsumoLitro: positiveNumber,
  costoSemillaHa: z.number().min(0),
  rendimientoCultivoTonHa: positiveNumber,
  precioTonelada: positiveNumber,
});

export const manualSchema = z.object({
  costoJornal: positiveNumber,
  rendimientoHaDia: positiveNumber,
  porcentajeDesperdicio: percentage,
});

export const tractorSchema = z.object({
  costoOperadorDia: positiveNumber,
  consumoCombustibleHa: positiveNumber,
  precioCombustible: positiveNumber,
  mantenimientoAnual: z.number().min(0),
  costoEquipoTotal: positiveNumber,
  vidaUtilAnios: z.number().int().min(1).max(20),
  esRentado: z.boolean(),
  porcentajeDañoCultivo: percentage,
  rendimientoHaDia: positiveNumber,
  porcentajeDesperdicio: percentage,
});

export const dronePurchaseSchema = z.object({
  precioDrone: positiveNumber,
  vidaUtilAnios: z.number().int().min(1).max(10),
  mantenimientoAnual: z.number().min(0),
  costoBateriasAnual: z.number().min(0),
  costoOperadorDia: positiveNumber,
  rendimientoHaDia: positiveNumber,
  porcentajeReduccionInsumos: percentage,
});

export const droneDaaSSchema = z.object({
  costoPorHa: positiveNumber,
  porcentajeReduccionInsumos: percentage,
});

export const userInputsSchema = z.object({
  common: commonSchema,
  manual: manualSchema,
  tractor: tractorSchema,
  drone: z.object({
    model: z.enum(['purchase', 'daas']),
    purchase: dronePurchaseSchema,
    daas: droneDaaSSchema,
  }),
  includeManual: z.boolean(),
  includeTractor: z.boolean(),
});

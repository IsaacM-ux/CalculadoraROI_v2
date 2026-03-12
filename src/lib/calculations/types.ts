// ── Service types ──
export type ServiceType = 'fumigation' | 'seeding';

// ── Application method ──
export type DroneModel = 'purchase' | 'daas';

// ── Cost breakdown per method ──
export interface MethodCostBreakdown {
  manoDeObra: number;
  insumos: number;
  equipo: number;
  combustible: number;
  dañoCultivo: number;
  desperdicio: number;
  total: number;
  costoPorHectarea: number;
  tiempoDias: number;
}

// ── Per-method input structures ──
export interface ManualCostInputs {
  costoJornal: number;          // $/día por jornalero
  rendimientoHaDia: number;     // hectáreas que cubre 1 persona/día
  porcentajeDesperdicio: number; // 0-100, default ~20
}

export interface TractorCostInputs {
  costoOperadorDia: number;     // $/día operador
  consumoCombustibleHa: number; // litros/ha
  precioCombustible: number;    // $/litro
  mantenimientoAnual: number;   // $/año mantenimiento pulverizadora
  costoEquipoTotal: number;     // precio compra o renta anual
  vidaUtilAnios: number;        // años (si es propio)
  esRentado: boolean;           // true = renta anual, false = propio
  porcentajeDañoCultivo: number;// 0-100, default ~3
  rendimientoHaDia: number;     // ha/día
  porcentajeDesperdicio: number;// 0-100, default ~10
}

export interface DronePurchaseInputs {
  precioDrone: number;          // $
  vidaUtilAnios: number;        // años
  mantenimientoAnual: number;   // $/año
  costoBateriasAnual: number;   // $/año
  costoOperadorDia: number;     // $/día piloto
  rendimientoHaDia: number;     // ha/día (drone es rápido: ~40-80 ha/día)
  porcentajeReduccionInsumos: number; // 0-100, default ~25
}

export interface DroneDaaSInputs {
  costoPorHa: number;           // $/ha por el servicio
  porcentajeReduccionInsumos: number; // 0-100, default ~25
}

// ── Common inputs ──
export interface CommonInputs {
  serviceType: ServiceType;
  hectareas: number;
  aplicacionesAnio: number;
  dosisInsumosLHa: number;      // litros de agroquímico por ha
  precioInsumoLitro: number;    // $/litro del agroquímico
  // For seeding
  costoSemillaHa: number;      // $/ha cost of seed (seeding mode)
  rendimientoCultivoTonHa: number; // ton/ha yield
  precioTonelada: number;       // $/ton market price
}

// ── Crop preset data ──
export interface CropData {
  id: string;
  nombre: string;
  region: string;
  // Default costs per ha for each method
  manualCostHa: number;
  tractorCostHa: number;
  droneCostHa: number;
  // Defaults for common inputs
  aplicacionesAnio: number;
  dosisInsumosLHa: number;
  precioInsumoLitro: number;
  costoSemillaHa: number;
  rendimientoTonHa: number;
  precioTonelada: number;
  // Default reduction percentages
  reduccionInsumosDrone: number;
  // Default method-specific values
  costoJornalDefault: number;
  rendimientoManualHaDia: number;
  rendimientoTractorHaDia: number;
  rendimientoDroneHaDia: number;
}

// ── Full user inputs ──
export interface UserInputs {
  common: CommonInputs;
  manual: ManualCostInputs;
  tractor: TractorCostInputs;
  drone: {
    model: DroneModel;
    purchase: DronePurchaseInputs;
    daas: DroneDaaSInputs;
  };
  // Which methods to include in comparison
  includeManual: boolean;
  includeTractor: boolean;
}

// ── Calculation results ──
export interface SavingsResult {
  ahorroAnualVsManual: number;
  ahorroAnualVsTractor: number;
  porcentajeAhorroVsManual: number;
  porcentajeAhorroVsTractor: number;
}

export interface PaybackResult {
  mesesVsManual: number;
  mesesVsTractor: number;
}

export interface ProjectionYear {
  year: number;
  costoAcumuladoManual: number;
  costoAcumuladoTractor: number;
  costoAcumuladoDrone: number;
  ahorroAcumuladoVsManual: number;
  ahorroAcumuladoVsTractor: number;
}

export interface CalculationResult {
  manual: MethodCostBreakdown | null;
  tractor: MethodCostBreakdown | null;
  drone: MethodCostBreakdown;
  savings: SavingsResult;
  payback: PaybackResult | null; // null for DaaS model
  roiPorcentaje: number | null; // null for DaaS model (no capital investment)
  projection: ProjectionYear[];
}

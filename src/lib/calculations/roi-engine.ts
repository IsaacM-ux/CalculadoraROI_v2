import type {
  UserInputs, CalculationResult, SavingsResult,
  PaybackResult, ProjectionYear,
} from './types';
import { calculateManualCost } from './manual';
import { calculateTractorCost } from './tractor';
import { calculateDroneCost } from './drone';
import { PROJECTION_YEARS } from '../data/defaults';

/**
 * Main entry point: calculates the full ROI comparison across all methods.
 */
export function calculateROI(inputs: UserInputs): CalculationResult {
  const manual = inputs.includeManual ? calculateManualCost(inputs) : null;
  const tractor = inputs.includeTractor ? calculateTractorCost(inputs) : null;
  const drone = calculateDroneCost(inputs);

  const savings = calculateSavings(manual, tractor, drone);
  const payback = inputs.drone.model === 'purchase'
    ? calculatePayback(inputs, manual, tractor, drone)
    : null;

  // ROI% only applies to the purchase model (capital investment).
  // DaaS has no upfront investment, so ROI% is not meaningful.
  let roiPorcentaje: number | null = null;
  if (inputs.drone.model === 'purchase') {
    const highestTraditional = Math.max(manual?.total ?? 0, tractor?.total ?? 0);
    const investment = inputs.drone.purchase.precioDrone;
    roiPorcentaje = investment > 0
      ? ((highestTraditional - drone.total) / investment) * 100
      : 0;
  }

  const projection = calculateProjection(inputs, manual, tractor, drone);

  return { manual, tractor, drone, savings, payback, roiPorcentaje, projection };
}

function calculateSavings(
  manual: ReturnType<typeof calculateManualCost> | null,
  tractor: ReturnType<typeof calculateTractorCost> | null,
  drone: ReturnType<typeof calculateDroneCost>,
): SavingsResult {
  const ahorroAnualVsManual = manual ? manual.total - drone.total : 0;
  const ahorroAnualVsTractor = tractor ? tractor.total - drone.total : 0;

  return {
    ahorroAnualVsManual,
    ahorroAnualVsTractor,
    porcentajeAhorroVsManual: manual && manual.total > 0
      ? (ahorroAnualVsManual / manual.total) * 100
      : 0,
    porcentajeAhorroVsTractor: tractor && tractor.total > 0
      ? (ahorroAnualVsTractor / tractor.total) * 100
      : 0,
  };
}

function calculatePayback(
  inputs: UserInputs,
  manual: ReturnType<typeof calculateManualCost> | null,
  tractor: ReturnType<typeof calculateTractorCost> | null,
  drone: ReturnType<typeof calculateDroneCost>,
): PaybackResult {
  const dronePurchasePrice = inputs.drone.purchase.precioDrone;

  const ahorroMensualVsManual = manual
    ? (manual.total - drone.total) / 12
    : 0;
  const ahorroMensualVsTractor = tractor
    ? (tractor.total - drone.total) / 12
    : 0;

  return {
    mesesVsManual: ahorroMensualVsManual > 0
      ? dronePurchasePrice / ahorroMensualVsManual
      : Infinity,
    mesesVsTractor: ahorroMensualVsTractor > 0
      ? dronePurchasePrice / ahorroMensualVsTractor
      : Infinity,
  };
}

function calculateProjection(
  inputs: UserInputs,
  manual: ReturnType<typeof calculateManualCost> | null,
  tractor: ReturnType<typeof calculateTractorCost> | null,
  drone: ReturnType<typeof calculateDroneCost>,
): ProjectionYear[] {
  const years: ProjectionYear[] = [];
  const initialInvestment = inputs.drone.model === 'purchase'
    ? inputs.drone.purchase.precioDrone
    : 0;

  // Annual recurring drone cost (excluding the initial purchase already amortized in the breakdown)
  const droneAnnual = drone.total;
  const manualAnnual = manual?.total ?? 0;
  const tractorAnnual = tractor?.total ?? 0;

  for (let y = 1; y <= PROJECTION_YEARS; y++) {
    const costoAcumuladoManual = manualAnnual * y;
    const costoAcumuladoTractor = tractorAnnual * y;
    // For purchase model, year 1 includes the full drone price (not amortized)
    // because we want the "real cash outflow" in the projection
    const costoAcumuladoDrone = inputs.drone.model === 'purchase'
      ? initialInvestment + (drone.total - initialInvestment / inputs.drone.purchase.vidaUtilAnios) * y
      // For DaaS it's just the recurring cost
      : droneAnnual * y;

    years.push({
      year: y,
      costoAcumuladoManual,
      costoAcumuladoTractor,
      costoAcumuladoDrone,
      ahorroAcumuladoVsManual: costoAcumuladoManual - costoAcumuladoDrone,
      ahorroAcumuladoVsTractor: costoAcumuladoTractor - costoAcumuladoDrone,
    });
  }

  return years;
}

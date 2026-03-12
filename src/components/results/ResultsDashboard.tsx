'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { SavingsCards } from './SavingsCards';
import { ComparisonChart } from './ComparisonChart';
import { ProjectionChart } from './ProjectionChart';
import { MethodComparisonTable } from './MethodComparisonTable';
import type { CalculationResult } from '@/lib/calculations/types';
import { generatePdf } from '@/lib/pdf/generate-pdf';
import { Download, ArrowLeft } from 'lucide-react';

interface Props {
  results: CalculationResult;
  includeManual: boolean;
  includeTractor: boolean;
  droneModel: 'purchase' | 'daas';
  onBack: () => void;
}

export function ResultsDashboard({ results, includeManual, includeTractor, droneModel, onBack }: Props) {
  const dashboardRef = useRef<HTMLDivElement>(null);

  const maxAhorro = Math.max(
    results.savings.ahorroAnualVsManual,
    results.savings.ahorroAnualVsTractor,
  );

  const maxPorcentajeAhorro = Math.max(
    results.savings.porcentajeAhorroVsManual,
    results.savings.porcentajeAhorroVsTractor,
  );

  const paybackMin = results.payback
    ? Math.min(
        includeManual ? results.payback.mesesVsManual : Infinity,
        includeTractor ? results.payback.mesesVsTractor : Infinity,
      )
    : null;

  const handleDownloadPdf = async () => {
    if (!dashboardRef.current) return;
    try {
      await generatePdf(dashboardRef.current);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Error al generar el PDF. Intente nuevamente.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resultados del Análisis</h2>
          <p className="text-sm text-gray-500 mt-1">
            Comparación {[includeManual && 'Manual', includeTractor && 'Tractor'].filter(Boolean).join(' / ')} vs Drone
            ({droneModel === 'purchase' ? 'Compra' : 'Servicio DaaS'})
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button onClick={handleDownloadPdf}>
            <Download className="h-4 w-4 mr-1" />
            Descargar PDF
          </Button>
        </div>
      </div>

      <div ref={dashboardRef} className="space-y-6">
        <div data-pdf-section>
          <SavingsCards
            ahorroAnualMax={maxAhorro}
            roiPorcentaje={results.roiPorcentaje}
            paybackMeses={paybackMin}
            porcentajeAhorroMax={maxPorcentajeAhorro}
          />
        </div>

        <div data-pdf-section>
          <ComparisonChart
            manual={results.manual}
            tractor={results.tractor}
            drone={results.drone}
          />
        </div>

        <div data-pdf-section>
          <ProjectionChart
            projection={results.projection}
            includeManual={includeManual}
            includeTractor={includeTractor}
          />
        </div>

        <div data-pdf-section>
          <MethodComparisonTable
            manual={results.manual}
            tractor={results.tractor}
            drone={results.drone}
          />
        </div>

        {/* Savings detail cards */}
        <div data-pdf-section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {includeManual && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <h4 className="font-medium text-red-800">Ahorro vs Manual</h4>
              <p className="text-2xl font-bold text-red-700 mt-1">
                ${Math.max(0, results.savings.ahorroAnualVsManual).toLocaleString()}/año
              </p>
              <p className="text-sm text-red-600">
                {results.savings.porcentajeAhorroVsManual.toFixed(1)}% de reducción en costos
              </p>
              {results.payback && isFinite(results.payback.mesesVsManual) && (
                <p className="text-xs text-red-500 mt-1">
                  Recuperación en {Math.ceil(results.payback.mesesVsManual)} meses
                </p>
              )}
            </div>
          )}
          {includeTractor && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h4 className="font-medium text-amber-800">Ahorro vs Tractor</h4>
              <p className="text-2xl font-bold text-amber-700 mt-1">
                ${Math.max(0, results.savings.ahorroAnualVsTractor).toLocaleString()}/año
              </p>
              <p className="text-sm text-amber-600">
                {results.savings.porcentajeAhorroVsTractor.toFixed(1)}% de reducción en costos
              </p>
              {results.payback && isFinite(results.payback.mesesVsTractor) && (
                <p className="text-xs text-amber-500 mt-1">
                  Recuperación en {Math.ceil(results.payback.mesesVsTractor)} meses
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-xs text-gray-500">
        <strong>Disclaimer:</strong> Los valores mostrados son estimaciones basadas en los datos ingresados
        y promedios regionales de referencia. Los resultados reales pueden variar según condiciones climáticas,
        tipo de terreno, eficiencia del operador y precios de mercado vigentes. Se recomienda validar con
        datos reales de su operación.
      </div>
    </div>
  );
}

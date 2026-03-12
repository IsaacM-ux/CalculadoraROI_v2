'use client';

import { useState } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { StepWizard } from '@/components/calculator/StepWizard';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';

export default function CalculadoraPage() {
  const calc = useCalculator();
  const [showResults, setShowResults] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Calculadora de ROI
          </h1>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Compara los costos de fumigación y siembra: método manual, tractor y drone.
            Descubre cuánto puedes ahorrar.
          </p>
        </div>

        {showResults ? (
          <ResultsDashboard
            results={calc.results}
            includeManual={calc.inputs.includeManual}
            includeTractor={calc.inputs.includeTractor}
            droneModel={calc.inputs.drone.model}
            onBack={() => setShowResults(false)}
          />
        ) : (
          <StepWizard
            calc={calc}
            onShowResults={() => setShowResults(true)}
          />
        )}
      </div>
    </main>
  );
}

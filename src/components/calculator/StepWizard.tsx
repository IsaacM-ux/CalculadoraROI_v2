'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Step1Service } from './Step1Service';
import { Step2Area } from './Step2Area';
import { Step3Manual } from './Step3Manual';
import { Step4Tractor } from './Step4Tractor';
import { Step5Drone } from './Step5Drone';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import type { useCalculator } from '@/hooks/useCalculator';

type CalcReturn = ReturnType<typeof useCalculator>;

interface Props {
  calc: CalcReturn;
  onShowResults: () => void;
}

const stepLabels = ['Servicio', 'Superficie', 'Manual', 'Tractor', 'Drone'];

export function StepWizard({ calc, onShowResults }: Props) {
  const { step, totalSteps, nextStep, prevStep, goToStep } = calc;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {stepLabels.map((label, i) => (
          <button
            key={label}
            onClick={() => goToStep(i)}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 group cursor-pointer',
            )}
          >
            <div
              className={cn(
                'h-2 w-full rounded-full transition-colors',
                i <= step ? 'bg-green-500' : 'bg-gray-200 group-hover:bg-gray-300',
              )}
            />
            <span
              className={cn(
                'text-xs transition-colors hidden sm:block',
                i <= step ? 'text-green-700 font-medium' : 'text-gray-400',
              )}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Step content */}
      <Card>
        <CardContent className="pt-6">
          {step === 0 && (
            <Step1Service
              serviceType={calc.inputs.common.serviceType}
              selectedCropId={calc.selectedCropId}
              onServiceChange={(v) => calc.updateCommon('serviceType', v)}
              onCropChange={calc.selectCrop}
            />
          )}
          {step === 1 && (
            <Step2Area
              common={calc.inputs.common}
              onChange={calc.updateCommon}
            />
          )}
          {step === 2 && (
            <Step3Manual
              manual={calc.inputs.manual}
              included={calc.inputs.includeManual}
              onIncludedChange={calc.setIncludeManual}
              onChange={calc.updateManual}
            />
          )}
          {step === 3 && (
            <Step4Tractor
              tractor={calc.inputs.tractor}
              included={calc.inputs.includeTractor}
              onIncludedChange={calc.setIncludeTractor}
              onChange={calc.updateTractor}
            />
          )}
          {step === 4 && (
            <Step5Drone
              model={calc.inputs.drone.model}
              purchase={calc.inputs.drone.purchase}
              daas={calc.inputs.drone.daas}
              onModelChange={calc.setDroneModel}
              onPurchaseChange={calc.updateDronePurchase}
              onDaaSChange={calc.updateDroneDaaS}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        {step < totalSteps - 1 ? (
          <Button onClick={nextStep}>
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={() => {
            const errors = calc.validate();
            if (errors.length > 0) {
              alert(`Corrige los siguientes campos antes de continuar:\n\n${errors.join('\n')}`);
              return;
            }
            onShowResults();
          }}>
            <BarChart3 className="h-4 w-4 mr-1" />
            Ver Resultados
          </Button>
        )}
      </div>
    </div>
  );
}

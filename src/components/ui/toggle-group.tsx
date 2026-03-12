import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleGroupProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  className?: string;
}

export function ToggleGroup({ label, value, onChange, options, className }: ToggleGroupProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && <span className="block text-sm font-medium text-gray-700">{label}</span>}
      <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all',
              value === opt.value
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

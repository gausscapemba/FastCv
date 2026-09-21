import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full mb-6 sm:mb-8">
      <div className="flex items-start justify-between gap-1 sm:gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={`
                  w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
                  transition-colors duration-200 shrink-0
                  ${
                    currentStep > step.id
                      ? 'bg-green-600 text-white'
                      : currentStep === step.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }
                `}
              >
                {currentStep > step.id ? (
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  <span className="text-[10px] sm:text-xs font-semibold">{step.id + 1}</span>
                )}
              </div>
              <div className="mt-2 hidden text-center md:block">
                <p
                  className={`text-[9px] sm:text-[11px] font-medium truncate ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                  }`}
                  title={step.title}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-1 mx-1 sm:mx-2 transition-colors duration-200
                  ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
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
    <nav aria-label="Etapas do currículo" className="w-full">
      <ol className="space-y-1">
        {steps.map((step, index) => {
          const isCurrent = currentStep === step.id;
          const isComplete = currentStep > step.id;
          return (
            <li key={step.id} aria-current={isCurrent ? 'step' : undefined}>
              <div className={`flex min-h-11 items-center gap-3 rounded-md px-2 py-1.5 ${isCurrent ? 'bg-[#E5E9DD]' : ''}`}>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isComplete
                      ? 'bg-[#174A3B] text-white'
                      : isCurrent
                        ? 'bg-[#174A3B] text-white ring-4 ring-[#D8F279] ring-offset-1 ring-offset-[#E5E9DD]'
                        : 'bg-[#EAE9E2] text-[#626A64]'
                  }`}
                >
                  {isComplete ? <Check aria-hidden="true" className="h-4 w-4" /> : <span className="text-xs font-semibold">{step.id + 1}</span>}
                </span>
                <span className="min-w-0">
                  <span className={`block truncate text-sm ${isCurrent ? 'font-bold text-[#174A3B]' : isComplete ? 'font-semibold text-[#17231E]' : 'font-medium text-[#626A64]'}`}>
                    {step.title}
                  </span>
                  <span className="block truncate text-xs text-[#626A64]">{step.description}</span>
                </span>
              </div>
              {index < steps.length - 1 && <div aria-hidden="true" className="ml-[15px] h-2 border-l border-[#C9CDC4]" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import { Label } from './label';

export interface MultiStepProps {
  size: number;
  currentStep?: number;
}

export function MultiStep({ size, currentStep = 1 }: MultiStepProps) {
  return (
    <div>
      <Label>
        Passo {currentStep} de {size}
      </Label>

      <div
        className='grid gap-2 mt-1'
        style={
          {
            gridTemplateColumns: 'repeat(var(--steps-size), 1fr)',
            '--steps-size': size,
          } as React.CSSProperties & { '--steps-size': number }
        }
      >
        {Array.from({ length: size }, (_, i) => i + 1).map((step) => {
          return <Step key={step} active={currentStep >= step} />;
        })}
      </div>
    </div>
  );

  function Step({ active }: { active: boolean }) {
    return (
      <div
        className={
          'col-span-1 h-1 rounded-s-xs ' +
          (active ? 'bg-gray-100' : 'bg-gray-600')
        }
      ></div>
    );
  }
}

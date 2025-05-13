// src/components/ui/spinner.tsx
import React from 'react';

interface SpinnerProps {
  label?: string;
  color?: string;
  responsive?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ label = 'Loading...', color = 'border-blue-500', responsive = true }) => {
  const spinnerSize = responsive
    ? 'h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 border-4'
    : 'h-8 w-8 border-4';

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-2 text-center text-gray-600">
      <div
        className={`animate-spin rounded-full border-t-transparent ${spinnerSize} ${color}`}
      />
      {label && <span className="text-sm md:text-base">{label}</span>}
    </div>
  );
};

export default Spinner;

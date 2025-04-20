import React from 'react';

interface FormulaDisplayProps {
  formula: string;
  className?: string;
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ 
  formula,
  className = "text-center mt-6 mb-3" 
}) => {
  return (
    <div className={className}>
      <span className="text-xs text-base-content/60 font-mono break-all">
        {formula}
      </span>
    </div>
  );
};

export default FormulaDisplay;

import React from 'react';

type UnitOption = {
  value: string;
  label: string;
};

interface UnitSelectorProps {
  options: UnitOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({
  options,
  value,
  onChange,
  label = "Unit of Measurement",
  className = "w-full mx-auto md:max-w-xs mb-4"
}) => {
  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label className="label py-2">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <div className="input-group">
        {options.map((option) => (
          <button
            key={option.value}
            className={`btn btn-md flex-1 ${value === option.value ? 'btn-active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UnitSelector;

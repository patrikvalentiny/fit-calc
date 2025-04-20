import React from 'react';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: number | '') => void;
  placeholder?: string;
  tooltip?: string;
  type?: string;
  inputMode?: 'numeric' | 'decimal' | 'tel';
  min?: number;
  max?: number;
  className?: string;
  unit?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  tooltip,
  type = 'number',
  inputMode = 'decimal',
  min,
  max,
  className = 'w-full',
  unit
}) => {
  return (
    <div className={`form-control ${className}`}>
      <label className="label py-2">
        <span className="label-text font-medium">
          {label} {unit && `(${unit})`}
        </span>
        {tooltip && (
          <span className="label-text-alt">
            <div className="tooltip" data-tip={tooltip}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </span>
        )}
      </label>
      <input
        type={type}
        inputMode={inputMode}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className="input input-bordered input-primary w-full h-12 text-base"
        value={value}
        onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : '')}
        min={min}
        max={max}
      />
    </div>
  );
};

export default InputField;

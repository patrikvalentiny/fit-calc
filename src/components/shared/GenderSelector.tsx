import React from 'react';

interface GenderSelectorProps {
  value: string;
  onChange: (gender: 'male' | 'female') => void;
  label?: string;
  className?: string;
  note?: string;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({
  value,
  onChange,
  label = "Gender",
  className = "w-full",
  note
}) => {
  return (
    <div className={`form-control ${className}`}>
      <label className="label py-2">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="input-group">
        <button
          className={`btn btn-md flex-1 ${value === 'male' ? 'btn-active' : ''}`}
          onClick={() => onChange('male')}
        >
          Male
        </button>
        <button
          className={`btn btn-md flex-1 ${value === 'female' ? 'btn-active' : ''}`}
          onClick={() => onChange('female')}
        >
          Female
        </button>
      </div>
      {note && (
        <label className="label">
          <span className="label-text-alt text-xs">{note}</span>
        </label>
      )}
    </div>
  );
};

export default GenderSelector;

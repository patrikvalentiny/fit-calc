import React from 'react';

interface CalculateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  text?: string;
  loadingText?: string;
  className?: string;
}

const CalculateButton: React.FC<CalculateButtonProps> = ({
  onClick,
  loading,
  disabled,
  text = 'Calculate',
  loadingText = 'Calculating...',
  className = 'btn-primary h-14 w-full md:btn-wide text-base'
}) => {
  return (
    <div className="flex justify-center my-6">
      <button
        className={`btn ${className}`}
        onClick={onClick}
        disabled={loading || disabled}
      >
        {loading ? (
          <>
            <span className="loading loading-spinner"></span>
            {loadingText && <span className="ml-2">{loadingText}</span>}
          </>
        ) : (
          text
        )}
      </button>
    </div>
  );
};

export default CalculateButton;

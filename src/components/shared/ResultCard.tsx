import React from 'react';

interface ResultCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: string;
  className?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  subtitle,
  badgeText,
  badgeColor = 'primary',
  className = 'bg-primary text-primary-content'
}) => {
  return (
    <div className={`stats shadow ${className} w-full`}>
      <div className="stat p-4 text-center">
        <div className="stat-title text-sm sm:text-base opacity-80">{title}</div>
        <div className="stat-value text-3xl sm:text-4xl my-2 break-all">{value}</div>
        {subtitle && (
          <div className="stat-desc text-xs sm:text-sm opacity-70">{subtitle}</div>
        )}
        {badgeText && (
          <div className="stat-desc text-center">
            <span className={`badge badge-${badgeColor} badge-lg mt-2 py-3 px-4 text-sm`}>
              {badgeText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;

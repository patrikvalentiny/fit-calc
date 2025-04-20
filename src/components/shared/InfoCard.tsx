import React, { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  color?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  icon,
  color = 'info',
  className = 'mt-6 p-4'
}) => {
  return (
    <div className={`alert alert-${color} shadow-lg ${className}`}>
      {icon || (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )}
      <div>
        <h3 className="font-bold">{title}</h3>
        <div className="text-xs sm:text-sm">{children}</div>
      </div>
    </div>
  );
};

export default InfoCard;

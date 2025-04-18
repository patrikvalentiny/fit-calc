import React from 'react';

interface NavigationProps {
  activeCalculator: string;
  setActiveCalculator: (calculator: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeCalculator, 
  setActiveCalculator}) => {
  const calculators = [
    { id: 'bmi', name: 'BMI Calculator'},
    { id: 'bmr', name: 'BMR Calculator'},
    { id: 'orm', name: 'One Rep Max' },
    { id: 'mhr', name: 'Max Heart Rate' },
    { id: 'whr', name: 'Waist-to-Hip Ratio' }
  ];

  // Find current calculator name for dropdown display
  const currentCalculator = calculators.find(calc => calc.id === activeCalculator)?.name || 'Select Calculator';

  return (
    <>
      {/* Mobile dropdown */}
      <div className="dropdown w-full md:hidden mb-4">
        <div tabIndex={0} role="button" className="btn btn-primary w-full m-1 flex justify-between">
          <span>{currentCalculator}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full">
          {calculators.map(calc => (
            <li key={calc.id}>
              <a 
                className={activeCalculator === calc.id ? 'active' : ''}
                onClick={() => {
                  setActiveCalculator(calc.id);
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                }}
              >
                {calc.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Desktop tabs */}
      <div className="hidden md:flex tabs tabs-bordered justify-center mb-4">
        {calculators.map(calc => (
          <button
            key={calc.id}
            className={`tab tab-lg ${activeCalculator === calc.id ? 'tab-active' : ''}`}
            onClick={() => setActiveCalculator(calc.id)}
          >
            {calc.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default Navigation;

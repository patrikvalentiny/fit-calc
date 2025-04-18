import React from 'react';

interface NavigationProps {
  activeCalculator: string;
  setActiveCalculator: (calculator: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeCalculator, 
  setActiveCalculator}) => {
  const calculators = [
    // Basic calculators
    { id: 'bmi', name: 'BMI Calculator', category: 'Basic' },
    { id: 'bmr', name: 'BMR Calculator', category: 'Basic' },
    { id: 'orm', name: 'One Rep Max', category: 'Fitness' },
    { id: 'mhr', name: 'Max Heart Rate', category: 'Fitness' },
    
    // Body measurement calculators
    { id: 'whr', name: 'Waist-to-Hip Ratio', category: 'Body Measurement' },
    { id: 'wth', name: 'Waist-to-Height', category: 'Body Measurement' },
    { id: 'bf', name: 'Body Fat %', category: 'Body Measurement' },
    { id: 'frame', name: 'Body Frame Size', category: 'Body Measurement' },
    { id: 'ctw', name: 'Chest-to-Waist', category: 'Body Measurement' }
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
          {calculators.map((calc) => (
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
      
      {/* Desktop tabs - with scrollable container for many tabs */}
      <div className="hidden md:block mb-4 overflow-x-auto">
        <div className="tabs tabs-bordered flex">
          {calculators.map(calc => (
            <button
              key={calc.id}
              className={`tab tab-lg whitespace-nowrap ${activeCalculator === calc.id ? 'tab-active' : ''}`}
              onClick={() => setActiveCalculator(calc.id)}
            >
              {calc.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;

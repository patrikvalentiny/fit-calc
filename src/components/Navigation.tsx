import React, { useState, useEffect } from 'react';
import { saveToStorage, getFromStorage, STORAGE_KEYS } from '../utils/localStorage';

interface Calculator {
  id: string;
  name: string;
  category: string;
  order?: number;
  favorite?: boolean;
}

interface NavigationProps {
  activeCalculator: string;
  setActiveCalculator: (calculator: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeCalculator, 
  setActiveCalculator}) => {
  const defaultCalculators: Calculator[] = [
    // Basic calculators
    { id: 'bmi', name: 'BMI Calculator', category: 'Basic' },
    { id: 'bmr', name: 'BMR Calculator', category: 'Basic' },
    { id: 'orm', name: 'One Rep Max', category: 'Fitness' },
    // { id: 'mhr', name: 'Max Heart Rate', category: 'Fitness' },
    
    // Body measurement calculators
    // { id: 'whr', name: 'Waist-to-Hip Ratio', category: 'Body Measurement' },
    // { id: 'wth', name: 'Waist-to-Height', category: 'Body Measurement' },
    { id: 'bf', name: 'Body Fat %', category: 'Body Measurement' },
    // { id: 'frame', name: 'Body Frame Size', category: 'Body Measurement' },
    // { id: 'ctw', name: 'Chest-to-Waist', category: 'Body Measurement' }
  ];

  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedCalc, setDraggedCalc] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(() => 
    getFromStorage<boolean>(STORAGE_KEYS.SHOW_FAVORITES_ONLY, false)
  );

  // Load calculator order and favorites from localStorage
  useEffect(() => {
    const savedOrder = getFromStorage<{[key: string]: number}>(STORAGE_KEYS.CALCULATOR_ORDER, {});
    const savedFavorites = getFromStorage<string[]>(STORAGE_KEYS.CALCULATOR_FAVORITES, []);
    
    const orderedCalcs = defaultCalculators.map(calc => ({
      ...calc,
      order: savedOrder[calc.id] !== undefined ? savedOrder[calc.id] : defaultCalculators.findIndex(c => c.id === calc.id),
      favorite: savedFavorites.includes(calc.id)
    }));
    
    // Sort by favorites first, then by order
    orderedCalcs.sort((a, b) => {
      if ((a.favorite && b.favorite) || (!a.favorite && !b.favorite)) {
        return (a.order || 0) - (b.order || 0);
      }
      return a.favorite ? -1 : 1;
    });
    
    setCalculators(orderedCalcs);
  }, []);

  // Save calculator order to localStorage
  const saveCalculatorOrder = (calcs: Calculator[]) => {
    const orderMap: {[key: string]: number} = {};
    calcs.forEach((calc, index) => {
      orderMap[calc.id] = index;
    });
    saveToStorage(STORAGE_KEYS.CALCULATOR_ORDER, orderMap);
  };

  // Save calculator favorites to localStorage
  const saveCalculatorFavorites = (calcs: Calculator[]) => {
    const favorites = calcs.filter(calc => calc.favorite).map(calc => calc.id);
    saveToStorage(STORAGE_KEYS.CALCULATOR_FAVORITES, favorites);
  };

  // Toggle calculator favorite status
  const toggleFavorite = (id: string) => {
    const updatedCalcs = calculators.map(calc => 
      calc.id === id ? { ...calc, favorite: !calc.favorite } : calc
    );
    
    // Sort by favorites first, then by order
    updatedCalcs.sort((a, b) => {
      if ((a.favorite && b.favorite) || (!a.favorite && !b.favorite)) {
        return (a.order || 0) - (b.order || 0);
      }
      return a.favorite ? -1 : 1;
    });
    
    setCalculators(updatedCalcs);
    saveCalculatorFavorites(updatedCalcs);
  };

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedCalc(id);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop for reordering
  const handleDrop = (targetId: string) => {
    if (!draggedCalc || draggedCalc === targetId) return;
    
    const draggedIndex = calculators.findIndex(calc => calc.id === draggedCalc);
    const targetIndex = calculators.findIndex(calc => calc.id === targetId);
    
    if (draggedIndex < 0 || targetIndex < 0) return;
    
    const newCalculators = [...calculators];
    const [removed] = newCalculators.splice(draggedIndex, 1);
    newCalculators.splice(targetIndex, 0, removed);
    
    // Update order property
    newCalculators.forEach((calc, index) => {
      calc.order = index;
    });
    
    setCalculators(newCalculators);
    saveCalculatorOrder(newCalculators);
    setDraggedCalc(null);
  };

  // Move calculator up or down in order
  const moveCalculator = (id: string, direction: 'up' | 'down') => {
    const index = calculators.findIndex(calc => calc.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === calculators.length - 1)
    ) {
      return;
    }
    
    const newCalculators = [...calculators];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newCalculators[index], newCalculators[targetIndex]] = [newCalculators[targetIndex], newCalculators[index]];
    
    // Update order property
    newCalculators.forEach((calc, index) => {
      calc.order = index;
    });
    
    setCalculators(newCalculators);
    saveCalculatorOrder(newCalculators);
  };

  // Prevent dropdown from closing when toggling reorder mode
  const toggleReordering = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setIsReordering(!isReordering);
  };

  // Function to toggle favorites filter and save to localStorage
  const toggleFavoritesFilter = () => {
    const newState = !showFavoritesOnly;
    setShowFavoritesOnly(newState);
    saveToStorage(STORAGE_KEYS.SHOW_FAVORITES_ONLY, newState);
  };

  // Get filtered calculators based on showFavoritesOnly state
  const filteredCalculators = showFavoritesOnly 
    ? calculators.filter(calc => calc.favorite)
    : calculators;

  // Find current calculator name for dropdown display
  const currentCalculator = calculators.find(calc => calc.id === activeCalculator)?.name || 'Select Calculator';

  return (
    <>
      <div className="flex justify-between items-center mb-2 px-1">
        <h2 className="text-lg font-semibold">Calculators</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xs">All</span>
            <input 
              type="checkbox" 
              className="toggle toggle-sm toggle-primary" 
              checked={showFavoritesOnly}
              onChange={toggleFavoritesFilter}
            />
            <span className="text-xs">Favorites</span>
          </div>
          <button 
            className={`btn btn-sm ${isReordering ? 'btn-primary' : 'btn-ghost'}`}
            onClick={toggleReordering}
          >
            {isReordering ? 'Done' : 'Reorder'}
          </button>
        </div>
      </div>

      {/* Show message when no favorites are selected but filter is active */}
      {showFavoritesOnly && filteredCalculators.length === 0 && (
        <div className="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>No favorite calculators. Star some calculators while in reorder mode.</span>
        </div>
      )}

      {/* Mobile dropdown - force open when reordering */}
      <div className={`dropdown w-full md:hidden mb-4 ${isReordering ? 'dropdown-open' : ''}`}>
        <div tabIndex={0} role="button" className="btn btn-primary w-full m-1 flex justify-between">
          <span>{currentCalculator}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full">
          {filteredCalculators.map((calc) => (
            <li key={calc.id} className="border-b last:border-0">
              {isReordering ? (
                <div className="flex items-center justify-between p-2" onClick={(e) => e.stopPropagation()}>
                  <span className="flex-1">{calc.name}</span>
                  <div className="flex items-center">
                    <button 
                      className="btn btn-sm btn-ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(calc.id);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={calc.favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                      </svg>
                    </button>
                    <button 
                      className="btn btn-sm btn-ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveCalculator(calc.id, 'up');
                      }}
                      disabled={calculators.indexOf(calc) === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 15l-6-6-6 6"/>
                      </svg>
                    </button>
                    <button 
                      className="btn btn-sm btn-ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveCalculator(calc.id, 'down');
                      }}
                      disabled={calculators.indexOf(calc) === calculators.length - 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <a 
                  className={`flex items-center ${activeCalculator === calc.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCalculator(calc.id);
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                >
                  <span className="flex-1">{calc.name}</span>
                  {calc.favorite && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  )}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Desktop tabs - with scrollable container for many tabs */}
      <div className="hidden md:block mb-4 overflow-x-auto">
        <div className="tabs tabs-bordered flex">
          {filteredCalculators.map(calc => (
            <div 
              key={calc.id}
              className={`tab tab-lg whitespace-nowrap ${activeCalculator === calc.id ? 'tab-active' : ''}`}
              draggable={isReordering}
              onDragStart={() => handleDragStart(calc.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(calc.id)}
            >
              <div className="flex items-center gap-2">
                {isReordering ? (
                  <button 
                    className="btn btn-xs btn-ghost p-0"
                    onClick={() => toggleFavorite(calc.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={calc.favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  </button>
                ) : (
                  calc.favorite && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  )
                )}
                <span 
                  onClick={() => !isReordering && setActiveCalculator(calc.id)}
                  className={isReordering ? 'cursor-move' : 'cursor-pointer'}
                >
                  {calc.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;

import { useState, useEffect } from 'react'
import './App.css'
import { getFromStorage, saveToStorage, STORAGE_KEYS } from './utils/localStorage'

// Import calculator components
import BmiCalculator from './components/BmiCalculator'
import BmrCalculator from './components/BmrCalculator'
import OneRepMaxCalculator from './components/OneRepMaxCalculator'
import MaxHeartRateCalculator from './components/MaxHeartRateCalculator'
import WaistToHipRatioCalculator from './components/WaistToHipRatioCalculator'
import BodyFatCalculator from './components/BodyFatCalculator'
import WaistToHeightCalculator from './components/WaistToHeightCalculator'
import BodyFrameCalculator from './components/BodyFrameCalculator'
import ChestToWaistCalculator from './components/ChestToWaistCalculator'
import Navigation from './components/Navigation'

function App() {
  // Initialize activeCalculator with the value from localStorage or default to 'bmi'
  const [activeCalculator, setActiveCalculator] = useState(() => 
    getFromStorage<string>(STORAGE_KEYS.LAST_ACTIVE_CALCULATOR, 'bmi')
  );

  // Save activeCalculator to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LAST_ACTIVE_CALCULATOR, activeCalculator);
  }, [activeCalculator]);

  // Render the active calculator component
  const renderCalculator = () => {    
    switch (activeCalculator) {
      // Basic calculators
      case 'bmi':
        return <BmiCalculator />
      case 'bmr':
        return <BmrCalculator />
      case 'orm':
        return <OneRepMaxCalculator />
      case 'mhr':
        return <MaxHeartRateCalculator />
      
      // Body measurement calculators  
      case 'whr':
        return <WaistToHipRatioCalculator />
      case 'wth':
        return <WaistToHeightCalculator />
      case 'bf':
        return <BodyFatCalculator />
      case 'frame':
        return <BodyFrameCalculator />
      case 'ctw':
        return <ChestToWaistCalculator />
      
      default:
        return <BmiCalculator />
    }
  }

  return (
    <div className="min-h-screen bg-base-200 py-4 md:py-8">
      <div className="max-w-4xl mx-auto px-2 md:px-4">
        <div className="text-center mb-4 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Fitness Calculators</h1>
          <p className="text-base md:text-lg mt-2">Your toolkit for health and fitness metrics</p>
        </div>
        
        <Navigation 
          activeCalculator={activeCalculator} 
          setActiveCalculator={setActiveCalculator}
        />
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4 md:p-8">
            {renderCalculator()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

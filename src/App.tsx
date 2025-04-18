import { useState } from 'react'
import './App.css'

// Import calculator components
import BmiCalculator from './components/BmiCalculator'
import BmrCalculator from './components/BmrCalculator'
import OneRepMaxCalculator from './components/OneRepMaxCalculator'
import MaxHeartRateCalculator from './components/MaxHeartRateCalculator'
import WaistToHipRatioCalculator from './components/WaistToHipRatioCalculator'
import Navigation from './components/Navigation'

function App() {
  const [activeCalculator, setActiveCalculator] = useState('bmi');

  // Render the active calculator component
  const renderCalculator = () => {    
    switch (activeCalculator) {
      case 'bmi':
        return <BmiCalculator />
      case 'bmr':
        return <BmrCalculator />
      case 'orm':
        return <OneRepMaxCalculator />
      case 'mhr':
        return <MaxHeartRateCalculator />
      case 'whr':
        return <WaistToHipRatioCalculator />
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

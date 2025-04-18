import { useState, useEffect, useRef } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage, standardizeUnit } from '../utils/localStorage';
import { convertWeight, convertHeight, getHeightUnit, getWeightUnit } from '../utils/calculators/unitConversion';
import { calculateBmi, getBmiCategory, getWeightRangeForHeight } from '../utils/calculators/bmiCalculator';

const BmiCalculator = () => {
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<string>('metric');
  
  // Ref to track if values are already loaded from localStorage
  const valuesLoaded = useRef(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (!valuesLoaded.current) {
      const savedUnit = standardizeUnit(getFromStorage<string>(STORAGE_KEYS.UNIT_PREFERENCE, 'metric'));
      const savedWeight = getFromStorage<number | ''>(STORAGE_KEYS.WEIGHT, '');
      const savedHeight = getFromStorage<number | ''>(STORAGE_KEYS.HEIGHT, '');
      const savedResult = getFromStorage<number | null>(STORAGE_KEYS.BMI_RESULT, null);
      
      setUnit(savedUnit);
      setWeight(savedWeight);
      setHeight(savedHeight);
      setResult(savedResult);
      
      valuesLoaded.current = true;
    }
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    if (valuesLoaded.current) {
      saveToStorage(STORAGE_KEYS.UNIT_PREFERENCE, unit);
      saveToStorage(STORAGE_KEYS.WEIGHT, weight);
      saveToStorage(STORAGE_KEYS.HEIGHT, height);
      saveToStorage(STORAGE_KEYS.BMI_RESULT, result);
    }
  }, [unit, weight, height, result]);

  // Convert values only when switching units
  useEffect(() => {
    if (!valuesLoaded.current) return;
    
    // Convert values when unit changes
    if (weight !== '') {
      const fromUnit = unit === 'metric' ? 'imperial' : 'metric';
      setWeight(convertWeight(weight as number, fromUnit));
    }

    if (height !== '') {
      const fromUnit = unit === 'metric' ? 'imperial' : 'metric';
      setHeight(convertHeight(height as number, fromUnit));
    }
  }, [unit]); // Only run when unit changes

  const handleUnitChange = (newUnit: string) => {
    if (newUnit === unit) return;
    setUnit(newUnit);
  };

  const handleCalculateBmi = () => {
    if (weight !== '' && height !== '') {
      try {
        setLoading(true);
        setError(null);
        
        const bmiParams = {
          weight: weight as number,
          height: height as number,
          unit: unit as 'metric' | 'imperial'
        };
        
        const bmiResult = calculateBmi(bmiParams);
        setResult(bmiResult);
      } catch (err) {
        console.error('Failed to calculate BMI:', err);
        setError('Failed to calculate BMI. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">BMI Calculator</h2>
      
      <div className="divider">Measurements</div>
      
      <div className="form-control w-full mx-auto md:max-w-xs mb-4">
        <label className="label py-2">
          <span className="label-text font-medium">Unit of Measurement</span>
        </label>
        <div className="input-group">
          <button 
            className={`btn btn-md flex-1 ${unit === 'metric' ? 'btn-active' : ''}`}
            onClick={() => handleUnitChange('metric')}
          >
            Metric
          </button>
          <button 
            className={`btn btn-md flex-1 ${unit === 'imperial' ? 'btn-active' : ''}`}
            onClick={() => handleUnitChange('imperial')}
          >
            Imperial
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="form-control w-full">
          <label className="label py-2">
            <span className="label-text font-medium">Weight ({getWeightUnit(unit)})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure your weight without clothes">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter weight (${getWeightUnit(unit)})`}
            className="input input-bordered input-primary w-full h-12 text-base"
            value={weight}
            onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
        
        <div className="form-control w-full">
          <label className="label py-2">
            <span className="label-text font-medium">Height ({getHeightUnit(unit)})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure your height without shoes">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter height (${getHeightUnit(unit)})`}
            className="input input-bordered input-primary w-full h-12 text-base"
            value={height}
            onChange={(e) => setHeight(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
      </div>
      
      <div className="text-center mt-6 mb-4">
        <span className="text-xs text-base-content/60 font-mono break-all">
          {unit === 'metric' 
            ? "BMI = weight (kg) / (height (m))²" 
            : "BMI = 703 × weight (lbs) / (height (inches))²"}
        </span>
      </div>
      
      <div className="divider"></div>
      
      <div className="flex justify-center my-6">
        <button 
          className="btn btn-primary h-14 w-full md:btn-wide text-base" 
          onClick={handleCalculateBmi}
          disabled={loading || weight === '' || height === ''}
        >
          {loading ? <span className="loading loading-spinner"></span> : 'Calculate BMI'}
        </button>
      </div>
      
      {error && (
        <div className="alert alert-error mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {result !== null && !error && (
        <div className="mt-8">
          <div className="stats bg-primary text-primary-content shadow w-full">
            <div className="stat p-4 text-center">
              <div className="stat-title text-primary-content/80 text-base">Your BMI</div>
              <div className="stat-value text-4xl my-2">{result}</div>
              <div className="stat-desc text-center">
                <span className={`badge badge-${getBmiCategory(result).color} badge-lg mt-2 py-3 px-4 text-sm`}>
                  {getBmiCategory(result).label}
                </span>
              </div>
            </div>
          </div>
          
          <div className="collapse collapse-arrow bg-base-200 mt-6">
            <input type="checkbox" defaultChecked /> 
            <div className="collapse-title font-medium text-base p-4">
              What does this mean?
            </div>
            <div className="collapse-content p-0"> 
              {/* Mobile view - simple list format */}
              <div className="block md:hidden">
                <div className="divide-y divide-base-300">
                  <div className="p-4">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">BMI below 18.5</span>
                        <span className="badge badge-warning">Underweight</span>
                      </div>
                      {height !== '' && (
                        <div className="text-xs text-base-content/70 mt-1">
                          Healthy weight: &lt; {getWeightRangeForHeight(height as number, 18.5, unit as 'metric' | 'imperial')} {getWeightUnit(unit)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">BMI 18.5–24.9</span>
                        <span className="badge badge-success">Normal</span>
                      </div>
                      {height !== '' && (
                        <div className="text-xs text-base-content/70 mt-1">
                          Healthy weight: {getWeightRangeForHeight(height as number, 18.5, unit as 'metric' | 'imperial')}–{getWeightRangeForHeight(height as number, 24.9, unit as 'metric' | 'imperial')} {getWeightUnit(unit)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">BMI 25.0–29.9</span>
                        <span className="badge badge-warning">Overweight</span>
                      </div>
                      {height !== '' && (
                        <div className="text-xs text-base-content/70 mt-1">
                          Healthy weight: {getWeightRangeForHeight(height as number, 25, unit as 'metric' | 'imperial')}–{getWeightRangeForHeight(height as number, 29.9, unit as 'metric' | 'imperial')} {getWeightUnit(unit)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">BMI 30 or higher</span>
                        <span className="badge badge-error">Obese</span>
                      </div>
                      {height !== '' && (
                        <div className="text-xs text-base-content/70 mt-1">
                          Healthy weight: &gt; {getWeightRangeForHeight(height as number, 30, unit as 'metric' | 'imperial')} {getWeightUnit(unit)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {height === '' && (
                  <div className="p-4 text-center text-sm text-base-content/70">
                    Enter your height to see recommended weight ranges for each BMI category.
                  </div>
                )}
              </div>
              
              {/* Desktop view - table format */}
              <div className="hidden md:block p-4">
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>BMI Range</th>
                        <th>Category</th>
                        {height !== '' && <th>Weight Range for Your Height</th>}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Below 18.5</td>
                        <td><span className="badge badge-warning">Underweight</span></td>
                        {height !== '' && (
                          <td>
                            &lt; {getWeightRangeForHeight(height as number, 18.5, unit as 'metric' | 'imperial')} {getWeightUnit(unit)}
                          </td>
                        )}
                      </tr>
                      <tr>
                        <td>18.5–24.9</td>
                        <td><span className="badge badge-success">Normal</span></td>
                        {height !== '' && (
                          <td>
                            {getWeightRangeForHeight(height as number, 18.5, unit as 'metric' | 'imperial')}–{getWeightRangeForHeight(height as number, 24.9, unit as 'metric' | 'imperial')} {getWeightUnit(unit)}
                          </td>
                        )}
                      </tr>
                      <tr>
                        <td>25.0–29.9</td>
                        <td><span className="badge badge-warning">Overweight</span></td>
                        {height !== '' && (
                          <td>
                            {getWeightRangeForHeight(height as number, 25, unit as 'metric' | 'imperial')}–{getWeightRangeForHeight(height as number, 29.9, unit as 'metric' | 'imperial')} {getWeightUnit(unit)}
                          </td>
                        )}
                      </tr>
                      <tr>
                        <td>30 or higher</td>
                        <td><span className="badge badge-error">Obese</span></td>
                        {height !== '' && (
                          <td>
                            &gt; {getWeightRangeForHeight(height as number, 30, unit as 'metric' | 'imperial')} {getWeightUnit(unit)}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {height === '' && (
                  <div className="text-center text-sm mt-4 text-base-content/70">
                    Enter your height to see recommended weight ranges for each BMI category.
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="alert alert-info shadow-lg mt-6 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">Note</h3>
              <div className="text-xs sm:text-sm">BMI is a simple health metric but doesn't account for muscle mass, body composition, age, or other important factors.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BmiCalculator;

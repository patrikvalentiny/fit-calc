import { useState, useEffect, useRef } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage, standardizeUnit } from '../utils/localStorage';

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
      const convertedWeight = unit === 'metric'
        ? parseFloat((weight as number / 2.20462).toFixed(1)) // Convert lbs to kg
        : parseFloat((weight as number * 2.20462).toFixed(1)); // Convert kg to lbs
      setWeight(convertedWeight);
    }

    if (height !== '') {
      const convertedHeight = unit === 'metric'
        ? parseFloat((height as number * 2.54).toFixed(1)) // Convert inches to cm
        : parseFloat((height as number / 2.54).toFixed(1)); // Convert cm to inches
      setHeight(convertedHeight);
    }
  }, [unit]); // Only run when unit changes

  const handleUnitChange = (newUnit: string) => {
    if (newUnit === unit) return;
    setUnit(newUnit);
  };

  const calculateBmi = () => {
    if (weight !== '' && height !== '') {
      try {
        setLoading(true);
        setError(null);
        
        let bmi: number;
        
        if (unit === 'metric') {
          // BMI formula: weight (kg) / (height (m))²
          const w = weight as number;
          const h = height as number / 100; // Convert cm to meters
          bmi = w / (h * h);
        } else {
          // BMI formula (imperial): 703 * weight (lbs) / (height (inches))²
          const w = weight as number;
          const h = height as number;
          bmi = 703 * w / (h * h);
        }
        
        setResult(parseFloat(bmi.toFixed(2)));
      } catch (err) {
        console.error('Failed to calculate BMI:', err);
        setError('Failed to calculate BMI. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'warning' };
    if (bmi < 25) return { label: 'Normal weight', color: 'success' };
    if (bmi < 30) return { label: 'Overweight', color: 'warning' };
    return { label: 'Obese', color: 'error' };
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">BMI Calculator</h2>
      
      <div className="divider">Measurements</div>
      
      <div className="form-control w-full mx-auto md:max-w-xs">
        <label className="label">
          <span className="label-text font-medium">Unit of Measurement</span>
        </label>
        <div className="input-group">
          <button 
            className={`btn flex-1 ${unit === 'metric' ? 'btn-active' : ''}`}
            onClick={() => handleUnitChange('metric')}
          >
            Metric
          </button>
          <button 
            className={`btn flex-1 ${unit === 'imperial' ? 'btn-active' : ''}`}
            onClick={() => handleUnitChange('imperial')}
          >
            Imperial
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure your weight without clothes">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter weight (${unit === 'metric' ? 'kg' : 'lbs'})`}
            className="input input-bordered input-primary w-full"
            value={weight}
            onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Height ({unit === 'metric' ? 'cm' : 'inches'})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure your height without shoes">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter height (${unit === 'metric' ? 'cm' : 'inches'})`}
            className="input input-bordered input-primary w-full"
            value={height}
            onChange={(e) => setHeight(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
      </div>
      
      <div className="text-center mt-4 mb-2">
        <span className="text-xs text-base-content/60 font-mono">
          {unit === 'metric' 
            ? "BMI = weight (kg) / (height (m))²" 
            : "BMI = 703 × weight (lbs) / (height (inches))²"}
        </span>
      </div>
      
      <div className="divider"></div>
      
      <div className="flex justify-center mt-4">
        <button 
          className="btn btn-primary w-full md:btn-wide" 
          onClick={calculateBmi}
          disabled={loading || weight === '' || height === ''}
        >
          {loading ? <span className="loading loading-spinner"></span> : 'Calculate BMI'}
        </button>
      </div>
      
      {error && (
        <div className="alert alert-error mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {result !== null && !error && (
        <div className="mt-6">
          <div className="stats bg-primary text-primary-content shadow w-full flex-col md:flex-row">
            <div className="stat">
              <div className="stat-title text-primary-content/80">Your BMI</div>
              <div className="stat-value">{result}</div>
              <div className="stat-desc">
                <span className={`badge badge-${getBmiCategory(result).color} badge-lg mt-1`}>
                  {getBmiCategory(result).label}
                </span>
              </div>
            </div>
          </div>
          
          <div className="collapse collapse-arrow bg-base-200 mt-4">
            <input type="checkbox" defaultChecked /> 
            <div className="collapse-title font-medium">
              What does this mean?
            </div>
            <div className="collapse-content"> 
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>BMI Range</th>
                      <th>Category</th>
                      {height !== '' && <th>Weight Range for Your Height</th>}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Less than 18.5</td>
                      <td><span className="badge badge-warning">Underweight</span></td>
                      {height !== '' && (
                        <td>
                          {unit === 'metric'
                            ? `< ${Math.round(18.5 * Math.pow(height as number / 100, 2))} kg`
                            : `< ${Math.round(18.5 * Math.pow(height as number, 2) / 703)} lbs`}
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td>18.5 - 24.9</td>
                      <td><span className="badge badge-success">Normal weight</span></td>
                      {height !== '' && (
                        <td>
                          {unit === 'metric'
                            ? `${Math.round(18.5 * Math.pow(height as number / 100, 2))} - ${Math.round(24.9 * Math.pow(height as number / 100, 2))} kg`
                            : `${Math.round(18.5 * Math.pow(height as number, 2) / 703)} - ${Math.round(24.9 * Math.pow(height as number, 2) / 703)} lbs`}
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td>25 - 29.9</td>
                      <td><span className="badge badge-warning">Overweight</span></td>
                      {height !== '' && (
                        <td>
                          {unit === 'metric'
                            ? `${Math.round(25 * Math.pow(height as number / 100, 2))} - ${Math.round(29.9 * Math.pow(height as number / 100, 2))} kg`
                            : `${Math.round(25 * Math.pow(height as number, 2) / 703)} - ${Math.round(29.9 * Math.pow(height as number, 2) / 703)} lbs`}
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td>30 or greater</td>
                      <td><span className="badge badge-error">Obese</span></td>
                      {height !== '' && (
                        <td>
                          {unit === 'metric'
                            ? `> ${Math.round(30 * Math.pow(height as number / 100, 2))} kg`
                            : `> ${Math.round(30 * Math.pow(height as number, 2) / 703)} lbs`}
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
              {height === '' && (
                <div className="text-sm mt-2 text-base-content/70">
                  Enter your height to see recommended weight ranges for each BMI category.
                </div>
              )}
            </div>
          </div>
          
          <div className="alert alert-info shadow-lg mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">Note</h3>
              <div className="text-xs">BMI is a simple health metric but doesn't account for muscle mass, body composition, age, or other important factors.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BmiCalculator;

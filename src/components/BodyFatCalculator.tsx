import { useState, useEffect, useRef } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage, standardizeUnit, getUnitDisplayValue } from '../utils/localStorage';

const BodyFatCalculator = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState<number | ''>('');
  const [waist, setWaist] = useState<number | ''>('');
  const [neck, setNeck] = useState<number | ''>('');
  const [hip, setHip] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<string>('cm');
  
  // Refs to track loading and conversion state
  const valuesLoaded = useRef(false);
  const initialConversionDone = useRef(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (!valuesLoaded.current) {
      // Get standardized unit
      const savedUnit = standardizeUnit(getFromStorage<string>(STORAGE_KEYS.UNIT_PREFERENCE, 'metric'));
      // Convert to display value for body fat calculator
      const unitValue = getUnitDisplayValue(savedUnit, 'bodyFat');
      
      const savedGender = getFromStorage<'male' | 'female'>(STORAGE_KEYS.GENDER, 'male');
      const savedHeight = getFromStorage<number | ''>(STORAGE_KEYS.HEIGHT, '');
      const savedWaist = getFromStorage<number | ''>(STORAGE_KEYS.WAIST, '');
      const savedNeck = getFromStorage<number | ''>(STORAGE_KEYS.NECK, '');
      const savedHip = getFromStorage<number | ''>(STORAGE_KEYS.HIP, '');
      const savedResult = getFromStorage<number | null>(STORAGE_KEYS.BODY_FAT_RESULT, null);
      
      setUnit(unitValue);
      setGender(savedGender);
      setHeight(savedHeight);
      setWaist(savedWaist);
      setNeck(savedNeck);
      setHip(savedHip);
      setResult(savedResult);
      
      valuesLoaded.current = true;
      initialConversionDone.current = true;
    }
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    if (valuesLoaded.current) {
      // Save standardized unit
      saveToStorage(STORAGE_KEYS.UNIT_PREFERENCE, unit === 'cm' ? 'metric' : 'imperial');
    }
  }, [unit]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GENDER, gender);
  }, [gender]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.HEIGHT, height);
  }, [height]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WAIST, waist);
  }, [waist]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NECK, neck);
  }, [neck]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.HIP, hip);
  }, [hip]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BODY_FAT_RESULT, result);
  }, [result]);

  // Convert values when switching units
  useEffect(() => {
    // Skip the initial conversion
    if (!initialConversionDone.current) {
      initialConversionDone.current = true;
      return;
    }

    if (height !== '') {
      if (unit === 'cm') {
        // Convert from inches to cm
        setHeight(parseFloat((height as number * 2.54).toFixed(1)));
      } else {
        // Convert from cm to inches
        setHeight(parseFloat((height as number / 2.54).toFixed(1)));
      }
    }

    if (neck !== '') {
      if (unit === 'cm') {
        // Convert from inches to cm
        setNeck(parseFloat((neck as number * 2.54).toFixed(1)));
      } else {
        // Convert from cm to inches
        setNeck(parseFloat((neck as number / 2.54).toFixed(1)));
      }
    }

    if (waist !== '') {
      if (unit === 'cm') {
        // Convert from inches to cm
        setWaist(parseFloat((waist as number * 2.54).toFixed(1)));
      } else {
        // Convert from cm to inches
        setWaist(parseFloat((waist as number / 2.54).toFixed(1)));
      }
    }

    if (hip !== '') {
      if (unit === 'cm') {
        // Convert from inches to cm
        setHip(parseFloat((hip as number * 2.54).toFixed(1)));
      } else {
        // Convert from cm to inches
        setHip(parseFloat((hip as number / 2.54).toFixed(1)));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const calculateBodyFat = () => {
    if (height !== '' && waist !== '' && neck !== '' && (gender === 'male' || hip !== '')) {
      try {
        setLoading(true);
        setError(null);
        
        // Navy Method formulas
        let bodyFatPercentage: number;
        
        if (unit === 'cm') {
          // SI/Metric Units
          if (gender === 'male') {
            // Male formula (Metric): 495/(1.0324 - 0.19077×log10(waist-neck) + 0.15456×log10(height)) - 450
            bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist as number - neck as number) + 
                       0.15456 * Math.log10(height as number)) - 450;
          } else {
            // Female formula (Metric): 495/(1.29579 - 0.35004×log10(waist+hip-neck) + 0.22100×log10(height)) - 450
            bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10((waist as number) + (hip as number) - (neck as number)) + 
                       0.22100 * Math.log10(height as number)) - 450;
          }
        } else {
          // USC/Imperial Units (inches)
          if (gender === 'male') {
            // Male formula (USC): 86.010×log10(abdomen-neck) - 70.041×log10(height) + 36.76
            bodyFatPercentage = 86.010 * Math.log10(waist as number - neck as number) - 
                       70.041 * Math.log10(height as number) + 36.76;
          } else {
            // Female formula (USC): 163.205×log10(waist+hip-neck) - 97.684×(log10(height)) - 78.387
            bodyFatPercentage = 163.205 * Math.log10((waist as number) + (hip as number) - (neck as number)) - 
                       97.684 * Math.log10(height as number) - 78.387;
          }
        }
        
        // Ensure result is within reasonable range (0-60%)
        bodyFatPercentage = Math.max(0, Math.min(60, bodyFatPercentage));
        setResult(parseFloat(bodyFatPercentage.toFixed(1)));
      } catch (err) {
        console.error('Failed to calculate body fat:', err);
        setError('Failed to calculate body fat. Please ensure all measurements are valid.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const getBodyFatCategory = (bf: number, isMale: boolean) => {
    if (isMale) {
      if (bf < 6) return { label: 'Essential Fat', color: 'info' };
      if (bf < 14) return { label: 'Athletic', color: 'success' };
      if (bf < 18) return { label: 'Fitness', color: 'success' };
      if (bf < 25) return { label: 'Average', color: 'warning' };
      return { label: 'Obese', color: 'error' };
    } else {
      if (bf < 16) return { label: 'Essential Fat', color: 'info' };
      if (bf < 21) return { label: 'Athletic', color: 'success' };
      if (bf < 25) return { label: 'Fitness', color: 'success' };
      if (bf < 32) return { label: 'Average', color: 'warning' };
      return { label: 'Obese', color: 'error' };
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Body Fat Calculator</h2>
      
      <div className="divider">Measurements</div>
      
      <div className="form-control w-full mx-auto md:max-w-xs">
        <label className="label">
          <span className="label-text font-medium">Unit of Measurement</span>
        </label>
        <div className="input-group">
          <button 
            className={`btn flex-1 ${unit === 'cm' ? 'btn-active' : ''}`}
            onClick={() => setUnit('cm')}
          >
            Centimeters
          </button>
          <button 
            className={`btn flex-1 ${unit === 'inches' ? 'btn-active' : ''}`}
            onClick={() => setUnit('inches')}
          >
            Inches
          </button>
        </div>
      </div>
      
      <div className="form-control w-full mx-auto md:max-w-xs mt-4">
        <label className="label">
          <span className="label-text font-medium">Gender</span>
        </label>
        <div className="input-group">
          <button 
            className={`btn flex-1 ${gender === 'male' ? 'btn-active' : ''}`}
            onClick={() => setGender('male')}
          >
            Male
          </button>
          <button 
            className={`btn flex-1 ${gender === 'female' ? 'btn-active' : ''}`}
            onClick={() => setGender('female')}
          >
            Female
          </button>
        </div>
        <label className="label">
          <span className="label-text-alt">Calculation formulas differ by gender</span>
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Height ({unit})</span>
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
            placeholder={`Enter height (${unit})`}
            className="input input-bordered input-primary w-full"
            value={height}
            onChange={(e) => setHeight(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Neck ({unit})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure your neck below the larynx (Adam's apple)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter neck circumference (${unit})`}
            className="input input-bordered input-primary w-full"
            value={neck}
            onChange={(e) => setNeck(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Waist ({unit})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure at your natural waist (around navel)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter waist circumference (${unit})`}
            className="input input-bordered input-primary w-full"
            value={waist}
            onChange={(e) => setWaist(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
        
        {gender === 'female' && (
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Hip ({unit})</span>
              <span className="label-text-alt">
                <div className="tooltip" data-tip="Measure at the widest part of your hips">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder={`Enter hip circumference (${unit})`}
              className="input input-bordered input-primary w-full"
              value={hip}
              onChange={(e) => setHip(e.target.value ? parseFloat(e.target.value) : '')}
            />
          </div>
        )}
      </div>
      
      <div className="text-center mt-4 mb-2">
        <span className="text-xs text-base-content/60 font-mono">
          {gender === 'male' 
            ? "Body Fat % = 86.01 × log10(waist - neck) - 70.041 × log10(height) + 36.76" 
            : "Body Fat % = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387"}
        </span>
      </div>
      
      <div className="divider"></div>
      
      <div className="flex justify-center mt-4">
        <button 
          className="btn btn-primary w-full md:btn-wide" 
          onClick={calculateBodyFat}
          disabled={loading || height === '' || waist === '' || neck === '' || (gender === 'female' && hip === '')}
        >
          {loading ? <span className="loading loading-spinner"></span> : 'Calculate Body Fat'}
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
              <div className="stat-title text-primary-content/80">Your Body Fat Percentage</div>
              <div className="stat-value">{result}%</div>
              <div className="stat-desc text-primary-content/70">
                <span className={`badge badge-${getBodyFatCategory(result, gender === 'male').color} badge-lg mt-1`}>
                  {getBodyFatCategory(result, gender === 'male').label}
                </span>
              </div>
            </div>
          </div>
          
          <div className="collapse collapse-arrow bg-base-200 mt-4">
            <input type="checkbox" defaultChecked /> 
            <div className="collapse-title font-medium">
              Body Fat Percentage Categories
            </div>
            <div className="collapse-content"> 
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Men</th>
                      <th>Women</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="badge badge-info">Essential Fat</span></td>
                      <td>2-5%</td>
                      <td>10-15%</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-success">Athletic</span></td>
                      <td>6-13%</td>
                      <td>16-20%</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-success">Fitness</span></td>
                      <td>14-17%</td>
                      <td>21-24%</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-warning">Average</span></td>
                      <td>18-24%</td>
                      <td>25-31%</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-error">Obese</span></td>
                      <td>25%+</td>
                      <td>32%+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="alert alert-info shadow-lg mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">How to Measure</h3>
              <div className="text-xs">
                <p>For accurate results:</p>
                <ul className="list-disc ml-4 mt-1">
                  <li>Measure at your natural waist (around navel)</li>
                  <li>Measure your neck below the larynx</li>
                  <li>For hip measurement, measure at the widest part</li>
                  <li>Keep the measuring tape snug but not tight</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyFatCalculator;

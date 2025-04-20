import { useState, useEffect, useRef } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage, standardizeUnit } from '../utils/localStorage';
import InputField from './shared/InputField';
import UnitSelector from './shared/UnitSelector';
import GenderSelector from './shared/GenderSelector';
import CalculateButton from './shared/CalculateButton';
import ErrorAlert from './shared/ErrorAlert';
import FormulaDisplay from './shared/FormulaDisplay';
import useKeyPress from '../hooks/useKeyPress';

const BmrCalculator = () => {
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<string>('male');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activityLevel, setActivityLevel] = useState<number>(1.2);
  const [unit, setUnit] = useState<string>('metric');
  
  // Ref to track if values are already loaded from localStorage
  const valuesLoaded = useRef(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (!valuesLoaded.current) {
      const savedUnit = standardizeUnit(getFromStorage<string>(STORAGE_KEYS.UNIT_PREFERENCE, 'metric'));
      const savedWeight = getFromStorage<number | ''>(STORAGE_KEYS.WEIGHT, '');
      const savedHeight = getFromStorage<number | ''>(STORAGE_KEYS.HEIGHT, '');
      const savedAge = getFromStorage<number | ''>(STORAGE_KEYS.AGE, '');
      const savedGender = getFromStorage<string>(STORAGE_KEYS.GENDER, 'male');
      const savedActivityLevel = getFromStorage<number>(STORAGE_KEYS.ACTIVITY_LEVEL, 1.2);
      const savedResult = getFromStorage<number | null>(STORAGE_KEYS.BMR_RESULT, null);
      
      setUnit(savedUnit);
      setWeight(savedWeight);
      setHeight(savedHeight);
      setAge(savedAge);
      setGender(savedGender);
      setActivityLevel(savedActivityLevel);
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
      saveToStorage(STORAGE_KEYS.AGE, age);
      saveToStorage(STORAGE_KEYS.GENDER, gender);
      saveToStorage(STORAGE_KEYS.ACTIVITY_LEVEL, activityLevel);
      saveToStorage(STORAGE_KEYS.BMR_RESULT, result);
    }
  }, [unit, weight, height, age, gender, activityLevel, result]);

  // Convert values when switching units
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

  const calculateBmr = () => {
    if (weight !== '' && height !== '' && age !== '') {
      setLoading(true);
      setError(null);
      
      try {
        // Calculate BMR using Mifflin-St Jeor Equation
        let w = weight as number;
        let h = height as number;
        const a = age as number;
        
        // Convert imperial to metric for calculation if needed
        if (unit === 'imperial') {
          w = w / 2.20462; // Convert lbs to kg
          h = h * 2.54; // Convert inches to cm
        }
        
        let bmr: number;
        if (gender === 'male') {
          bmr = 10 * w + 6.25 * h - 5 * a + 5;
        } else {
          bmr = 10 * w + 6.25 * h - 5 * a - 161;
        }
        
        setResult(bmr);
      } catch (err) {
        setError('Failed to calculate BMR. Please try again.');
        console.error('BMR calculation error:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Handle Enter key press
  useKeyPress('Enter', calculateBmr, [weight, height, age], loading || weight === '' || height === '' || age === '');

  const getFormulaText = () => {
    return gender === 'male' 
      ? "BMR = 10×weight + 6.25×height - 5×age + 5" 
      : "BMR = 10×weight + 6.25×height - 5×age - 161";
  };

  const getActivityLevelLabel = () => {
    const levels = {
      1.2: "Sedentary (little or no exercise)",
      1.375: "Lightly active (light exercise 1-3 days/week)",
      1.55: "Moderately active (moderate exercise 3-5 days/week)",
      1.725: "Very active (hard exercise 6-7 days/week)",
      1.9: "Extra active (very hard exercise & physical job)"
    };
    return levels[activityLevel as keyof typeof levels];
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Basal Metabolic Rate Calculator</h2>
      
      <div className="divider">Your Details</div>
      
      <UnitSelector
        options={[
          { value: 'metric', label: 'Metric' },
          { value: 'imperial', label: 'Imperial' }
        ]}
        value={unit}
        onChange={handleUnitChange}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <InputField
          label="Weight"
          value={weight}
          onChange={setWeight}
          unit={unit === 'metric' ? 'kg' : 'lbs'}
        />
        
        <InputField
          label="Height"
          value={height}
          onChange={setHeight}
          unit={unit === 'metric' ? 'cm' : 'inches'}
        />
        
        <InputField
          label="Age"
          value={age}
          onChange={setAge}
          unit="years"
        />
        
        <GenderSelector
          value={gender}
          onChange={setGender}
        />
      </div>
      
      <FormulaDisplay formula={getFormulaText()} />
      
      <div className="divider mt-6">Activity Level</div>
      
      <div className="form-control w-full px-2 mt-4">
        <input 
          type="range" 
          min="1.2" 
          max="1.9" 
          value={activityLevel} 
          step="0.175"
          className="range range-primary w-full h-6" 
          onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
        />
        <div className="w-full flex justify-between text-xs px-1 mt-3 mb-1">
          <span>Sedentary</span>
          <span className="text-center">Light</span>
          <span className="text-center">Moderate</span>
          <span className="text-center">Very</span>
          <span>Extra</span>
        </div>
        <div className="bg-base-200 py-3 px-4 rounded-lg text-center text-sm mt-2">
          <span className="font-medium">{getActivityLevelLabel()}</span>
        </div>
      </div>
      
      <CalculateButton
        onClick={calculateBmr}
        loading={loading}
        disabled={weight === '' || height === '' || age === ''}
        text="Calculate BMR"
      />
      
      <ErrorAlert message={error} />
      
      {result !== null && (
        <div className="mt-8">
          <div className="stats shadow bg-primary text-primary-content w-full flex-col md:flex-row">
            <div className="stat p-4">
              <div className="stat-title text-primary-content/80 text-sm sm:text-base">Your BMR</div>
              <div className="stat-value text-3xl sm:text-4xl my-2 break-all">
                {result.toFixed(0)}
              </div>
              <div className="stat-desc text-primary-content/70 text-xs sm:text-sm">calories/day</div>
            </div>
            
            <div className="stat p-4">
              <div className="stat-title text-primary-content/80 text-sm sm:text-base">Daily Calories</div>
              <div className="stat-value text-3xl sm:text-4xl my-2 break-all">
                {(result * activityLevel).toFixed(0)}
              </div>
              <div className="stat-desc text-primary-content/70 text-xs sm:text-sm">
                with {activityLevel === 1.2 ? 'sedentary' : 'active'} lifestyle
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="card bg-accent text-accent-content shadow-sm">
              <div className="card-body p-3">
                <h3 className="card-title text-sm">Weight Goals</h3>
                <div className="text-xs space-y-1 mt-1">
                  <p><span className="font-medium">To lose weight:</span> {((result * activityLevel) - 500).toFixed(0)} calories/day</p>
                  <p className="text-[10px] text-accent-content/90 pl-2">
                  (500 cal deficit, ~0.5 {unit === 'metric' ? 'kg' : 'lbs'} per week)
                  </p>
                  <p><span className="font-medium">To gain weight:</span> {((result * activityLevel) + 500).toFixed(0)} calories/day</p>
                  <p className="text-[10px] text-accent-content/90 pl-2">
                  (500 cal surplus, ~0.5 {unit === 'metric' ? 'kg' : 'lbs'} per week)
                  </p>
                </div>
                </div>
              </div>
            
            <div className="card bg-info text-info-content shadow-sm">
              <div className="card-body p-3">
                <h3 className="card-title text-sm">What is BMR?</h3>
                <p className="text-xs">
                  Basal Metabolic Rate is the calories your body needs when completely at rest to maintain vital functions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BmrCalculator;

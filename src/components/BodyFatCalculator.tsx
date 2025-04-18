import { useState, useEffect, useRef } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage, standardizeUnit, getUnitDisplayValue } from '../utils/localStorage';
import { convertMeasurement } from '../utils/calculators/unitConversion';
import { calculateBodyFat, getBodyFatCategory } from '../utils/calculators/bodyFatCalculator';
import { 
  calculateIdealWeight,
  getIdealBodyFat,
  calculateBMIBodyFat,
  calculateFatToLose,
  calculateIdealWeightByFat,
  calculateFatMass,
  calculateLeanMass
} from '../utils/calculators/bodyCompositionCalculator';

// Types
interface CategoryType {
  label: string;
  color: 'info' | 'success' | 'warning' | 'error';
  min: number;
  max: number | null;
}

interface BodyFatTableProps {
  title: string;
  subtitle?: string;
  gender: 'male' | 'female';
  result: number;
  categories: CategoryType[];
  ageGroups?: string[];
  selectedAgeGroup?: string;
  onAgeGroupChange?: (ageGroup: string) => void;
  footnote?: string;
  weight?: number | '';  // Add weight parameter
  unit?: string;        // Add unit parameter for display
}

const BodyFatCalculator = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [waist, setWaist] = useState<number | ''>('');
  const [neck, setNeck] = useState<number | ''>('');
  const [hip, setHip] = useState<number | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<string>('cm');
  // const [aceAgeGroup, setAceAgeGroup] = useState<string>('20-29');
  const [nihAgeGroup, setNihAgeGroup] = useState<string>('20-39');
  const [acsmAgeGroup, setAcsmAgeGroup] = useState<string>('20-29');

  // Refs to track loading and conversion state
  const valuesLoaded = useRef(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (!valuesLoaded.current) {
      // Get standardized unit
      const savedUnit = standardizeUnit(getFromStorage<string>(STORAGE_KEYS.UNIT_PREFERENCE, 'metric'));
      // Convert to display value for body fat calculator
      const unitValue = getUnitDisplayValue(savedUnit, 'bodyFat');

      const savedGender = getFromStorage<'male' | 'female'>(STORAGE_KEYS.GENDER, 'male');
      const savedHeight = getFromStorage<number | ''>(STORAGE_KEYS.HEIGHT, '');
      const savedWeight = getFromStorage<number | ''>(STORAGE_KEYS.WEIGHT, '');
      const savedWaist = getFromStorage<number | ''>(STORAGE_KEYS.WAIST, '');
      const savedNeck = getFromStorage<number | ''>(STORAGE_KEYS.NECK, '');
      const savedHip = getFromStorage<number | ''>(STORAGE_KEYS.HIP, '');
      const savedAge = getFromStorage<number | ''>(STORAGE_KEYS.AGE, '');
      const savedResult = getFromStorage<number | null>(STORAGE_KEYS.BODY_FAT_RESULT, null);

      setUnit(unitValue);
      setGender(savedGender);
      setHeight(savedHeight);
      setWeight(savedWeight);
      setWaist(savedWaist);
      setNeck(savedNeck);
      setHip(savedHip);
      setAge(savedAge);
      setResult(savedResult);

      valuesLoaded.current = true;
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
    if (valuesLoaded.current) {
      saveToStorage(STORAGE_KEYS.GENDER, gender);
      saveToStorage(STORAGE_KEYS.HEIGHT, height);
      saveToStorage(STORAGE_KEYS.WEIGHT, weight);
      saveToStorage(STORAGE_KEYS.WAIST, waist);
      saveToStorage(STORAGE_KEYS.NECK, neck);
      saveToStorage(STORAGE_KEYS.HIP, hip);
      saveToStorage(STORAGE_KEYS.AGE, age);
      saveToStorage(STORAGE_KEYS.BODY_FAT_RESULT, result);
    }
  }, [gender, height, weight, waist, neck, hip, age, result]);

  // Convert values when switching units
  useEffect(() => {
    if (!valuesLoaded.current) return;

    if (height !== '') {
      setHeight(convertMeasurement(height as number, unit === 'cm' ? 'inches' : 'cm'));
    }

    if (weight !== '') {
      // Convert weight between kg and lbs
      setWeight(convertMeasurement(weight as number, unit === 'cm' ? 'lbs' : 'kg', 'weight'));
    }

    if (neck !== '') {
      setNeck(convertMeasurement(neck as number, unit === 'cm' ? 'inches' : 'cm'));
    }

    if (waist !== '') {
      setWaist(convertMeasurement(waist as number, unit === 'cm' ? 'inches' : 'cm'));
    }

    if (hip !== '') {
      setHip(convertMeasurement(hip as number, unit === 'cm' ? 'inches' : 'cm'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const handleUnitChange = (newUnit: string) => {
    if (newUnit === unit) return;
    setUnit(newUnit);
  };

  const handleCalculateBodyFat = () => {
    if (height !== '' && waist !== '' && neck !== '' && (gender === 'male' || hip !== '')) {
      try {
        setLoading(true);
        setError(null);

        const bodyFatParams = {
          gender,
          height: height as number,
          waist: waist as number,
          neck: neck as number,
          hip: hip as number || 0,
          unit: unit as 'cm' | 'inches'
        };

        setTimeout(() => {
          try {
            const bodyFatPercentage = calculateBodyFat(bodyFatParams);
            setResult(bodyFatPercentage);
            setLoading(false);
          } catch (err) {
            console.error('Failed to calculate body fat:', err);
            setError('Failed to calculate body fat. Please ensure all measurements are valid.');
            setLoading(false);
          }
        }, 500); // Add a small delay for UX
      } catch (err) {
        console.error('Failed to calculate body fat:', err);
        setError('Failed to calculate body fat. Please ensure all measurements are valid.');
        setLoading(false);
      }
    } else {
      setError('Please fill in all required fields.');
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Body Fat Calculator</h2>

      <div className="divider">Measurements</div>

      <div className="form-control w-full mx-auto md:max-w-xs mb-4">
        <label className="label py-2">
          <span className="label-text font-medium">Unit of Measurement</span>
        </label>
        <div className="input-group">
          <button
            className={`btn btn-md flex-1 ${unit === 'cm' ? 'btn-active' : ''}`}
            onClick={() => handleUnitChange('cm')}
          >
            Centimeters
          </button>
          <button
            className={`btn btn-md flex-1 ${unit === 'inches' ? 'btn-active' : ''}`}
            onClick={() => handleUnitChange('inches')}
          >
            Inches
          </button>
        </div>
      </div>

      <div className="form-control w-full mx-auto md:max-w-xs mt-6">
        <label className="label py-2">
          <span className="label-text font-medium">Gender</span>
        </label>
        <div className="input-group">
          <button
            className={`btn btn-md flex-1 ${gender === 'male' ? 'btn-active' : ''}`}
            onClick={() => setGender('male')}
          >
            Male
          </button>
          <button
            className={`btn btn-md flex-1 ${gender === 'female' ? 'btn-active' : ''}`}
            onClick={() => setGender('female')}
          >
            Female
          </button>
        </div>
        <label className="label">
          <span className="label-text-alt text-xs">Calculation formulas differ by gender</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div className="form-control w-full">
          <label className="label py-2">
            <span className="label-text font-medium">Height ({unit})</span>
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
            placeholder={`Enter height (${unit})`}
            className="input input-bordered input-primary w-full h-12 text-base"
            value={height}
            onChange={(e) => setHeight(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>

        <div className="form-control w-full">
          <label className="label py-2">
            <span className="label-text font-medium">Weight ({unit === 'cm' ? 'kg' : 'lbs'})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Enter your current weight">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter weight (${unit === 'cm' ? 'kg' : 'lbs'})`}
            className="input input-bordered input-primary w-full h-12 text-base"
            value={weight}
            onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>

        <div className="form-control w-full">
          <label className="label py-2">
            <span className="label-text font-medium">Age</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Your age in years">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Enter age (years)"
            className="input input-bordered input-primary w-full h-12 text-base"
            value={age}
            onChange={(e) => setAge(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>

        <div className="form-control w-full">
          <label className="label py-2">
            <span className="label-text font-medium">Neck ({unit})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure your neck below the larynx (Adam's apple)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter neck circumference (${unit})`}
            className="input input-bordered input-primary w-full h-12 text-base"
            value={neck}
            onChange={(e) => setNeck(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>

        <div className="form-control w-full">
          <label className="label py-2">
            <span className="label-text font-medium">Waist ({unit})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure at your natural waist (around navel)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter waist circumference (${unit})`}
            className="input input-bordered input-primary w-full h-12 text-base"
            value={waist}
            onChange={(e) => setWaist(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>

        {gender === 'female' && (
          <div className="form-control w-full">
            <label className="label py-2">
              <span className="label-text font-medium">Hip ({unit})</span>
              <span className="label-text-alt">
                <div className="tooltip" data-tip="Measure at the widest part of your hips">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder={`Enter hip circumference (${unit})`}
              className="input input-bordered input-primary w-full h-12 text-base"
              value={hip}
              onChange={(e) => setHip(e.target.value ? parseFloat(e.target.value) : '')}
            />
          </div>
        )}
      </div>

      <div className="text-center mt-6 mb-3">
        <span className="text-xs text-base-content/60 font-mono break-all">
          {gender === 'male'
            ? "Body Fat % = 86.01 × log10(waist - neck) - 70.041 × log10(height) + 36.76"
            : "Body Fat % = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387"}
        </span>
      </div>

      <div className="divider"></div>

      <div className="flex justify-center my-6">
        <button
          className="btn btn-primary h-14 w-full md:btn-wide text-base"
          onClick={handleCalculateBodyFat}
          disabled={loading || height === '' || waist === '' || neck === '' || (gender === 'female' && hip === '')}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              <span className="ml-2">Calculating...</span>
            </>
          ) : (
            'Calculate Body Fat'
          )}
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
              <div className="stat-title text-primary-content/80 text-sm sm:text-base">Your Body Fat Percentage</div>
              <div className="stat-value text-3xl sm:text-4xl my-2">{result}%</div>
              <div className="stat-desc text-center">
                <span className={`badge badge-${getBodyFatCategory(result, gender === 'male').color} badge-lg mt-2 py-3 px-4 text-sm`}>
                  {getBodyFatCategory(result, gender === 'male').label}
                </span>
              </div>
            </div>
          </div>

          {/* Updated Weight Card with Ideal BF% and Weight to Lose */}
          {height && weight && age && (
            <div className="card bg-neutral text-neutral-content shadow-sm mt-4">
              <div className="card-body p-4">
                <h3 className="text-sm font-medium mb-2">Body Composition Analysis</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm opacity-80">Current Body Composition:</div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="grid grid-cols-2 text-sm">
                        <div className="flex items-center">
                          <span className="opacity-70">Body Fat:</span>
                        </div>
                        <span className="font-medium">{result}%</span>
                      </div>
                      
                      {weight !== undefined && (
                        <>
                          <div className="grid grid-cols-2 text-sm">
                            <div className="flex items-center">
                              <span className="opacity-70">Fat Mass:</span>
                            </div>
                            <span className="font-medium">{calculateFatMass(weight as number, result, unit as 'cm' | 'inches')}</span>
                          </div>
                          <div className="grid grid-cols-2 text-sm">
                            <div className="flex items-center">
                              <span className="opacity-70">Lean Mass:</span>
                            </div> 
                            <span className="font-medium">{calculateLeanMass(weight as number, result, unit as 'cm' | 'inches')}</span>
                          </div>
                          <div className="grid grid-cols-2 text-sm">
                            <div className="flex items-center">
                              <span className="opacity-70">BMI-based BF:</span>
                              <div className="tooltip ml-1" data-tip="Body fat estimated using BMI formula">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-4 w-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                              </div>
                            </div>
                            <span className="font-medium">{calculateBMIBodyFat(weight as number, height as number, age as number, gender, unit as 'cm' | 'inches')}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm opacity-80">Target Analysis:</div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="grid grid-cols-2 text-sm">
                        <div className="flex items-center">
                          <span className="opacity-70">Ideal Body Fat:</span>
                          <div className="tooltip ml-1" data-tip="Jackson & Pollock ideal body fat for your age">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-4 w-4">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                        </div>
                        <span className="font-medium">{getIdealBodyFat(age as number, gender)}%</span>
                      </div>
                      
                      {weight && (
                        <>
                          <div className="grid grid-cols-2 text-sm">
                            <div className="flex items-center">
                              <span className="opacity-70">Fat to Lose:</span>
                            </div>
                            <span className="font-medium">{calculateFatToLose(weight as number, result, age as number, gender, unit as 'cm' | 'inches')}</span>
                          </div>
                          <div className="grid grid-cols-2 text-sm">
                            <div className="flex items-center">
                              <span className="opacity-70">Ideal Weight:</span>
                            </div>
                            <span className="font-medium">{calculateIdealWeightByFat(weight as number, result, age as number, gender, unit as 'cm' | 'inches')}</span>
                          </div>
                        </>
                      )}
                      
                      <div className="grid grid-cols-2 text-sm">
                        <div className="flex items-center">
                          <span className="opacity-70">Ideal Range:</span>
                        </div>
                        <span className="font-medium">{calculateIdealWeight(height as number, gender, unit as 'cm' | 'inches')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="collapse collapse-arrow bg-base-200 mt-6">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title font-medium text-base p-4">
              Body Fat Percentage Categories
            </div>
            <div className="collapse-content px-2 sm:px-4">
              {/* Body Fat Standards Tables */}
              {result !== null && (
                <div className="space-y-6">
                  {/* ACE Body Fat Standards */}
                  <BodyFatTable
                    title="American Council on Exercise"
                    gender={gender}
                    result={result}
                    categories={
                      gender === 'male' 
                        ? [
                            { label: 'Essential', color: 'info', min: 2, max: 5.9 },
                            { label: 'Athletes', color: 'success', min: 6, max: 13.9 },
                            { label: 'Fitness', color: 'success', min: 14, max: 17.9 },
                            { label: 'Acceptable', color: 'warning', min: 18, max: 24.9 },
                            { label: 'Obese', color: 'error', min: 25, max: null },
                          ]
                        : [
                            { label: 'Essential', color: 'info', min: 10, max: 13.9 },
                            { label: 'Athletes', color: 'success', min: 14, max: 20.9 },
                            { label: 'Fitness', color: 'success', min: 21, max: 24.9 },
                            { label: 'Acceptable', color: 'warning', min: 25, max: 31.9 },
                            { label: 'Obese', color: 'error', min: 32, max: null },
                          ]
                    }
                    weight={weight}
                    unit={unit}
                  />

                  {/* WHO/NIH Guidelines */}
                  <BodyFatTable
                    title="WHO / NIH Guidelines (Gallagher et al.)"
                    gender={gender}
                    result={result}
                    ageGroups={['20-39', '40-59', '60-79']}
                    selectedAgeGroup={nihAgeGroup}
                    onAgeGroupChange={setNihAgeGroup}
                    categories={getNIHCategories(gender, nihAgeGroup)}
                    weight={weight}
                    unit={unit}
                  />

                  {/* ACSM Standards */}
                  <BodyFatTable
                    title="American College of Sports Medicine"
                    gender={gender}
                    result={result}
                    ageGroups={['20-29', '30-39', '40-49', '50-59', '60+']}
                    selectedAgeGroup={acsmAgeGroup}
                    onAgeGroupChange={setAcsmAgeGroup}
                    categories={getACSMCategories(gender, acsmAgeGroup)}
                    footnote="* Adapted from ACSM's Health-Related Physical Fitness Assessment manual, 5th Edition."
                    weight={weight}
                    unit={unit}
                  />
                </div>
              )}
              
              {result === null && (
                <div className="text-center p-4 text-base-content/70 text-sm">
                  Calculate your body fat percentage to see detailed category information
                </div>
              )}
            </div>
          </div>

          {/* Reference Section */}
          <div className="collapse collapse-arrow bg-base-200 mt-6">
            <input type="checkbox" /> 
            <div className="collapse-title font-medium text-base p-4">
              References and Standards
            </div>
            <div className="collapse-content px-2 sm:px-4">
              <div className="card bg-base-100 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h3 className="card-title text-sm">
                    American Council on Exercise Body Fat Categories
                    <div className="badge badge-ghost">{gender === 'male' ? 'Men' : 'Women'}</div>
                  </h3>
                  <table className="table table-zebra table-compact w-full">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Body Fat %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gender === 'male' ? (
                        <>
                          <tr><td>Essential Fat</td><td>2-5%</td></tr>
                          <tr><td>Athletes</td><td>6-13%</td></tr>
                          <tr><td>Fitness</td><td>14-17%</td></tr>
                          <tr><td>Average</td><td>18-24%</td></tr>
                          <tr><td>Obese</td><td>25+%</td></tr>
                        </>
                      ) : (
                        <>
                          <tr><td>Essential Fat</td><td>10-13%</td></tr>
                          <tr><td>Athletes</td><td>14-20%</td></tr>
                          <tr><td>Fitness</td><td>21-24%</td></tr>
                          <tr><td>Average</td><td>25-31%</td></tr>
                          <tr><td>Obese</td><td>32+%</td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <h3 className="card-title text-sm">
                    Jackson & Pollock Ideal Body Fat Percentages
                    <div className="badge badge-ghost">{gender === 'male' ? 'Men' : 'Women'}</div>
                  </h3>
                  <table className="table table-zebra table-compact w-full">
                    <thead>
                      <tr>
                        <th>Age</th>
                        <th>Ideal Body Fat %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gender === 'male' ? (
                        <>
                          <tr><td>20</td><td>8.5%</td></tr>
                          <tr><td>25</td><td>10.5%</td></tr>
                          <tr><td>30</td><td>12.7%</td></tr>
                          <tr><td>35</td><td>13.7%</td></tr>
                          <tr><td>40</td><td>15.3%</td></tr>
                          <tr><td>45</td><td>16.4%</td></tr>
                          <tr><td>50</td><td>18.9%</td></tr>
                          <tr><td>55+</td><td>20.9%</td></tr>
                        </>
                      ) : (
                        <>
                          <tr><td>20</td><td>17.7%</td></tr>
                          <tr><td>25</td><td>18.4%</td></tr>
                          <tr><td>30</td><td>19.3%</td></tr>
                          <tr><td>35</td><td>21.5%</td></tr>
                          <tr><td>40</td><td>22.2%</td></tr>
                          <tr><td>45</td><td>22.9%</td></tr>
                          <tr><td>50</td><td>25.2%</td></tr>
                          <tr><td>55+</td><td>26.3%</td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-info text-info-content shadow-sm mt-6">
            <div className="card-body p-4">
              <h3 className="card-title text-sm items-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                How to Measure
              </h3>
              <div className="text-xs sm:text-sm">
                <p>For accurate results:</p>
                <ul className="list-disc ml-4 mt-1 space-y-1">
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

// Helper functions to get categories based on age groups
const getNIHCategories = (gender: 'male' | 'female', ageGroup: string): CategoryType[] => {
  if (gender === 'male') {
    switch (ageGroup) {
      case '20-39':
        return [
          { label: 'Underfat', color: 'info', min: 0, max: 7.9 },
          { label: 'Healthy', color: 'success', min: 8, max: 19.9 },
          { label: 'Overfat', color: 'warning', min: 20, max: 24.9 },
          { label: 'Obese', color: 'error', min: 25, max: null },
        ];
      case '40-59':
        return [
          { label: 'Underfat', color: 'info', min: 0, max: 10.9 },
          { label: 'Healthy', color: 'success', min: 11, max: 21.9 },
          { label: 'Overfat', color: 'warning', min: 22, max: 27.9 },
          { label: 'Obese', color: 'error', min: 28, max: null },
        ];
      case '60-79':
        return [
          { label: 'Underfat', color: 'info', min: 0, max: 12.9 },
          { label: 'Healthy', color: 'success', min: 13, max: 24.9 },
          { label: 'Overfat', color: 'warning', min: 25, max: 29.9 },
          { label: 'Obese', color: 'error', min: 30, max: null },
        ];
      default:
        return [];
    }
  } else {
    switch (ageGroup) {
      case '20-39':
        return [
          { label: 'Underfat', color: 'info', min: 0, max: 20.9 },
          { label: 'Healthy', color: 'success', min: 21, max: 32.9 },
          { label: 'Overfat', color: 'warning', min: 33, max: 38.9 },
          { label: 'Obese', color: 'error', min: 39, max: null },
        ];
      case '40-59':
        return [
          { label: 'Underfat', color: 'info', min: 0, max: 22.9 },
          { label: 'Healthy', color: 'success', min: 23, max: 33.9 },
          { label: 'Overfat', color: 'warning', min: 34, max: 39.9 },
          { label: 'Obese', color: 'error', min: 40, max: null },
        ];
      case '60-79':
        return [
          { label: 'Underfat', color: 'info', min: 0, max: 23.9 },
          { label: 'Healthy', color: 'success', min: 24, max: 35.9 },
          { label: 'Overfat', color: 'warning', min: 36, max: 41.9 },
          { label: 'Obese', color: 'error', min: 42, max: null },
        ];
      default:
        return [];
    }
  }
};

const getACSMCategories = (gender: 'male' | 'female', ageGroup: string): CategoryType[] => {
  if (gender === 'male') {
    switch (ageGroup) {
      case '20-29':
        return [
          { label: 'Very Lean', color: 'info', min: 4.2, max: 7.8 },
          { label: 'Excellent', color: 'success', min: 7.9, max: 11.4 },
          { label: 'Good', color: 'success', min: 11.5, max: 15.7 },
          { label: 'Fair', color: 'warning', min: 15.8, max: 19.6 },
          { label: 'Poor', color: 'warning', min: 19.7, max: 24.8 },
          { label: 'Very Poor', color: 'error', min: 24.9, max: null },
        ];
      case '30-39':
        return [
          { label: 'Very Lean', color: 'info', min: 7.3, max: 11.3 },
          { label: 'Excellent', color: 'success', min: 11.4, max: 15.0 },
          { label: 'Good', color: 'success', min: 15.1, max: 18.6 },
          { label: 'Fair', color: 'warning', min: 18.7, max: 22.3 },
          { label: 'Poor', color: 'warning', min: 22.4, max: 27.0 },
          { label: 'Very Poor', color: 'error', min: 27.1, max: null },
        ];
      case '40-49':
        return [
          { label: 'Very Lean', color: 'info', min: 9.2, max: 13.8 },
          { label: 'Excellent', color: 'success', min: 13.9, max: 17.4 },
          { label: 'Good', color: 'success', min: 17.5, max: 20.8 },
          { label: 'Fair', color: 'warning', min: 20.9, max: 24.1 },
          { label: 'Poor', color: 'warning', min: 24.2, max: 28.4 },
          { label: 'Very Poor', color: 'error', min: 28.5, max: null },
        ];
      case '50-59':
        return [
          { label: 'Very Lean', color: 'info', min: 10.8, max: 16.2 },
          { label: 'Excellent', color: 'success', min: 16.3, max: 19.4 },
          { label: 'Good', color: 'success', min: 19.5, max: 22.6 },
          { label: 'Fair', color: 'warning', min: 22.7, max: 25.8 },
          { label: 'Poor', color: 'warning', min: 25.9, max: 29.5 },
          { label: 'Very Poor', color: 'error', min: 29.6, max: null },
        ];
      case '60+':
        return [
          { label: 'Very Lean', color: 'info', min: 11.2, max: 16.8 },
          { label: 'Excellent', color: 'success', min: 16.9, max: 20.2 },
          { label: 'Good', color: 'success', min: 20.3, max: 23.5 },
          { label: 'Fair', color: 'warning', min: 23.6, max: 26.7 },
          { label: 'Poor', color: 'warning', min: 26.8, max: 30.4 },
          { label: 'Very Poor', color: 'error', min: 30.5, max: null },
        ];
      default:
        return [];
    }
  } else {
    switch (ageGroup) {
      case '20-29':
        return [
          { label: 'Very Lean', color: 'info', min: 11.5, max: 15.7 },
          { label: 'Excellent', color: 'success', min: 15.8, max: 19.6 },
          { label: 'Good', color: 'success', min: 19.7, max: 23.7 },
          { label: 'Fair', color: 'warning', min: 23.8, max: 27.7 },
          { label: 'Poor', color: 'warning', min: 27.8, max: 32.8 },
          { label: 'Very Poor', color: 'error', min: 32.9, max: null },
        ];
      case '30-39':
        return [
          { label: 'Very Lean', color: 'info', min: 12.8, max: 17.0 },
          { label: 'Excellent', color: 'success', min: 17.1, max: 20.9 },
          { label: 'Good', color: 'success', min: 21.0, max: 24.8 },
          { label: 'Fair', color: 'warning', min: 24.9, max: 28.8 },
          { label: 'Poor', color: 'warning', min: 28.9, max: 33.8 },
          { label: 'Very Poor', color: 'error', min: 33.9, max: null },
        ];
      case '40-49':
        return [
          { label: 'Very Lean', color: 'info', min: 14.8, max: 19.0 },
          { label: 'Excellent', color: 'success', min: 19.1, max: 22.9 },
          { label: 'Good', color: 'success', min: 23.0, max: 26.8 },
          { label: 'Fair', color: 'warning', min: 26.9, max: 30.8 },
          { label: 'Poor', color: 'warning', min: 30.9, max: 35.7 },
          { label: 'Very Poor', color: 'error', min: 35.8, max: null },
        ];
      case '50-59':
        return [
          { label: 'Very Lean', color: 'info', min: 16.8, max: 21.2 },
          { label: 'Excellent', color: 'success', min: 21.3, max: 25.3 },
          { label: 'Good', color: 'success', min: 25.4, max: 29.3 },
          { label: 'Fair', color: 'warning', min: 29.4, max: 33.2 },
          { label: 'Poor', color: 'warning', min: 33.3, max: 37.9 },
          { label: 'Very Poor', color: 'error', min: 38.0, max: null },
        ];
      case '60+':
        return [
          { label: 'Very Lean', color: 'info', min: 16.8, max: 21.2 },
          { label: 'Excellent', color: 'success', min: 21.3, max: 25.4 },
          { label: 'Good', color: 'success', min: 25.5, max: 29.4 },
          { label: 'Fair', color: 'warning', min: 29.5, max: 33.4 },
          { label: 'Poor', color: 'warning', min: 33.5, max: 38.5 },
          { label: 'Very Poor', color: 'error', min: 38.6, max: null },
        ];
      default:
        return [];
    }
  }
};

// Fixed BodyFatTable component with proper structure
const BodyFatTable = ({ 
  title, 
  subtitle, 
  result, 
  categories,
  ageGroups,
  selectedAgeGroup,
  onAgeGroupChange,
  footnote,
  weight,
  unit
}: BodyFatTableProps) => {
  const formatRange = (min: number, max: number | null) => {
    if (max === null) {
      return `${min}% and over`;
    } else if (min === 0) {
      return `under ${max}%`;
    } else {
      return `${min} to ${max}%`;
    }
  };

  const calculateWeightAtBodyFat = (targetBodyFat: number, currentWeight: number, currentBodyFat: number) => {
    // Calculate lean mass (stays constant)
    const leanMass = currentWeight * (1 - currentBodyFat / 100);
    // Calculate new weight based on target body fat
    const newWeight = leanMass / (1 - targetBodyFat / 100);
    return newWeight.toFixed(1);
  };

  const isInRange = (min: number, max: number | null, value: number) => {
    if (max === null) {
      return value >= min;
    } else if (min === 0) {
      return value < max;
    } else {
      return value >= min && value < max;
    }
  };

  const weightUnit = unit === 'cm' ? 'kg' : 'lbs';

  return (
    <div className="border border-base-300 rounded-lg overflow-hidden">
      <div className="bg-base-200 p-3">
        <h3 className="font-medium text-sm">
          {title}
          {subtitle && (
            <>
              <br />
              <span className="font-normal text-xs opacity-80">{subtitle}, Body Fat {result}%</span>
            </>
          )}
        </h3>
        
        {ageGroups && selectedAgeGroup && onAgeGroupChange && (
          <div className="overflow-x-auto mt-2">
            <div className="flex flex-wrap gap-1">
              <span className="text-xs opacity-70 self-center mr-1">Age Group:</span>
              {ageGroups.map(ageGroup => (
                <button
                  key={ageGroup}
                  className={`btn btn-xs ${selectedAgeGroup === ageGroup ? 'btn-active' : ''}`}
                  onClick={() => onAgeGroupChange(ageGroup)}
                >
                  {ageGroup}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th className="text-xs font-medium">Category</th>
              <th className="text-xs font-medium">Body Fat Range {weight && `(Est. Weight)`}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, idx) => (
              <tr 
                key={idx} 
                className={isInRange(category.min, category.max, result) ? 'bg-accent/10' : ''}
              >
                <td>
                      <span className={`badge badge-${category.color} badge-sm py-1 px-2 text-xs whitespace-normal h-auto min-h-[1.5rem] leading-tight flex items-center justify-center`}>
                      {category.label}
                      </span>
                </td>
                <td className="text-sm">
                  {formatRange(category.min, category.max)}
                  {weight && (
                    <span className="text-xs ml-1 opacity-90">
                      {category.max === null ? (
                        `(${calculateWeightAtBodyFat(category.min, weight as number, result)}+ ${weightUnit})`
                      ) : category.min === 0 ? (
                        `(<${calculateWeightAtBodyFat(category.max, weight as number, result)} ${weightUnit})`
                      ) : (
                        `(${calculateWeightAtBodyFat(category.min, weight as number, result)}-${calculateWeightAtBodyFat(category.max, weight as number, result)} ${weightUnit})`
                      )}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {footnote && (
        <div className="text-xs p-2 opacity-60 bg-base-100 border-t border-base-200">
          {footnote}
        </div>
      )}
    </div>
  );
};

export default BodyFatCalculator;

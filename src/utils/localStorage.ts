// Constants for localStorage keys
export const STORAGE_KEYS = {
  // Shared keys
  UNIT_PREFERENCE: 'fitCalc.unitPreference',
  GENDER: 'fitCalc.gender',
  HEIGHT: 'fitCalc.height',
  WEIGHT: 'fitCalc.weight',
  
  // BMI specific keys
  BMI_RESULT: 'fitCalc.bmiResult',
  
  // Body Fat specific keys
  NECK: 'fitCalc.neck',
  WAIST: 'fitCalc.waist',
  HIP: 'fitCalc.hip',
  BODY_FAT_RESULT: 'fitCalc.bodyFatResult',
  
  // BMR specific keys
  AGE: 'fitCalc.age',
  ACTIVITY_LEVEL: 'fitCalc.activityLevel',
  BMR_RESULT: 'fitCalc.bmrResult',

  // OneRepMax specific keys
  LIFTING_WEIGHT: 'fitCalc.liftingWeight', // New key for OneRepMaxCalculator
  REPS: 'fitCalc.reps',
  FORMULA: 'fitCalc.formula',
  ONE_REP_MAX_RESULT: 'fitCalc.oneRepMaxResult',

  // Unit conversion flags to prevent double conversion
  UNIT_CONVERSION_DONE: 'fitCalc.unitConversionDone',
};

// Helper functions for localStorage
export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage with key ${key}:`, error);
  }
};

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error(`Error retrieving from localStorage with key ${key}:`, error);
    return defaultValue;
  }
};

// Clear all FitCalc data from localStorage
export const clearAllFitCalcData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing FitCalc data from localStorage:', error);
  }
};

// Standardize unit representation across calculators
export const standardizeUnit = (unit: string): string => {
  // Convert body fat calculator units to standard format
  if (unit === 'cm') return 'metric';
  if (unit === 'inches') return 'imperial';
  return unit;
};

// Get appropriate unit display value based on calculator type
export const getUnitDisplayValue = (unit: string, calculatorType: 'bodyFat' | 'bmi' | 'bmr'): string => {
  if (calculatorType === 'bodyFat') {
    return unit === 'metric' ? 'cm' : 'inches';
  }
  return unit; // For BMI and BMR, keep as metric/imperial
};

// Body composition calculation functions

interface BodyCompositionResult {
  fatMass: number;
  leanMass: number;
  formattedFatMass: string;
  formattedLeanMass: string;
}

// Get ideal body fat percentage based on Jackson & Pollock data
export const getIdealBodyFat = (age: number, gender: 'male' | 'female'): number => {
  const maleData = [
    { age: 20, bf: 8.5 },
    { age: 25, bf: 10.5 },
    { age: 30, bf: 12.7 },
    { age: 35, bf: 13.7 },
    { age: 40, bf: 15.3 },
    { age: 45, bf: 16.4 },
    { age: 50, bf: 18.9 },
    { age: 55, bf: 20.9 }
  ];
  
  const femaleData = [
    { age: 20, bf: 17.7 },
    { age: 25, bf: 18.4 },
    { age: 30, bf: 19.3 },
    { age: 35, bf: 21.5 },
    { age: 40, bf: 22.2 },
    { age: 45, bf: 22.9 },
    { age: 50, bf: 25.2 },
    { age: 55, bf: 26.3 }
  ];
  
  const data = gender === 'male' ? maleData : femaleData;
  
  // Cap age at 55 for the calculation
  const cappedAge = Math.min(age, 55);
  
  // For ages below 20, use the 20-year-old value
  if (cappedAge < 20) return data[0].bf;
  
  // Find the two age points to interpolate between
  for (let i = 0; i < data.length - 1; i++) {
    if (cappedAge >= data[i].age && cappedAge <= data[i+1].age) {
      // Linear interpolation formula: y = y1 + (x - x1) * ((y2 - y1) / (x2 - x1))
      const x1 = data[i].age;
      const y1 = data[i].bf;
      const x2 = data[i+1].age;
      const y2 = data[i+1].bf;
      
      return parseFloat((y1 + (cappedAge - x1) * ((y2 - y1) / (x2 - x1))).toFixed(1));
    }
  }
  
  // Fallback to the highest age value
  return data[data.length - 1].bf;
};

// Calculate body composition (fat mass and lean mass)
export const calculateBodyComposition = (
  weight: number, 
  bodyFat: number, 
  unit: 'cm' | 'inches'
): BodyCompositionResult => {
  const fatMass = weight * (bodyFat / 100);
  const leanMass = weight * (1 - bodyFat / 100);
  const weightUnit = unit === 'cm' ? 'kg' : 'lbs';
  
  return {
    fatMass,
    leanMass,
    formattedFatMass: `${fatMass.toFixed(1)} ${weightUnit}`,
    formattedLeanMass: `${leanMass.toFixed(1)} ${weightUnit}`
  };
};

// Helper functions extracted from BodyFatCalculator for reuse
export const calculateFatMass = (weight: number, bodyFat: number, unit: 'cm' | 'inches'): string => {
  const fatMass = weight * (bodyFat / 100);
  return `${fatMass.toFixed(1)} ${unit === 'cm' ? 'kg' : 'lbs'}`;
};

export const calculateLeanMass = (weight: number, bodyFat: number, unit: 'cm' | 'inches'): string => {
  const leanMass = weight * (1 - bodyFat / 100);
  return `${leanMass.toFixed(1)} ${unit === 'cm' ? 'kg' : 'lbs'}`;
};

// Calculate body fat percentage using BMI method
export const calculateBMIBodyFat = (
  weight: number, 
  height: number, 
  age: number, 
  gender: 'male' | 'female', 
  unit: 'cm' | 'inches'
): number => {
  // Convert to metric if needed
  const heightInM = unit === 'cm' ? height / 100 : height * 0.0254;
  const weightInKg = unit === 'cm' ? weight : weight / 2.20462;
  
  // Calculate BMI
  const bmi = weightInKg / (heightInM * heightInM);
  
  // Gender factor (1 for male, 0 for female)
  const genderFactor = gender === 'male' ? 1 : 0;
  
  // Body fat percentage formula based on BMI
  // For adults: (1.20 × BMI) + (0.23 × Age) - (10.8 × gender) - 5.4
  const bodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
  
  return parseFloat(bodyFat.toFixed(1));
};

// Calculate fat mass to lose to reach ideal body fat
export const calculateFatToLose = (
  weight: number, 
  currentBF: number, 
  age: number, 
  gender: 'male' | 'female', 
  unit: 'cm' | 'inches'
): string => {
  const idealBF = getIdealBodyFat(age, gender);
  
  // If already at or below ideal, return zero
  if (currentBF <= idealBF) return `0 ${unit === 'cm' ? 'kg' : 'lbs'}`;
  
  // Calculate current fat mass
  const currentFatMass = weight * (currentBF / 100);
  
  // Calculate ideal fat mass
  const leanMass = weight * (1 - currentBF / 100);
  const idealWeight = leanMass / (1 - idealBF / 100);
  const idealFatMass = idealWeight * (idealBF / 100);
  
  // Calculate fat to lose
  const fatToLose = currentFatMass - idealFatMass;
  
  return `${fatToLose.toFixed(1)} ${unit === 'cm' ? 'kg' : 'lbs'}`;
};

// Calculate ideal weight based on current lean mass and ideal body fat
export const calculateIdealWeightByFat = (
  weight: number, 
  currentBF: number, 
  age: number, 
  gender: 'male' | 'female', 
  unit: 'cm' | 'inches'
): string => {
  const idealBF = getIdealBodyFat(age, gender);
  
  // Calculate lean mass
  const leanMass = weight * (1 - currentBF / 100);
  
  // Calculate ideal weight
  const idealWeight = leanMass / (1 - idealBF / 100);
  
  return `${idealWeight.toFixed(1)} ${unit === 'cm' ? 'kg' : 'lbs'}`;
};

// Helper function to calculate ideal weight based on height and gender
export const calculateIdealWeight = (
  height: number, 
  gender: 'male' | 'female', 
  unit: 'cm' | 'inches'
): string => {
  // Convert height to meters for calculation
  const heightInM = unit === 'cm' ? height / 100 : height * 0.0254;
  
  // Healthy body fat ranges
  const healthyBfMin = gender === 'male' ? 8 : 21;
  const healthyBfMax = gender === 'male' ? 19 : 32;
  
  // BMI ranges for healthy weight
  const bmi = gender === 'male' ? 22.5 : 21.5;
  
  // Calculate reference weight
  const refWeight = bmi * heightInM * heightInM;
  
  // Adjust weight for body fat ranges
  const lowerWeight = refWeight / (1 - healthyBfMin / 100);
  const upperWeight = refWeight / (1 - healthyBfMax / 100);
  
  // Format output based on unit
  const weightUnit = unit === 'cm' ? 'kg' : 'lbs';
  const conversionFactor = unit === 'cm' ? 1 : 2.20462;
  
  return `${(lowerWeight * conversionFactor).toFixed(1)} - ${(upperWeight * conversionFactor).toFixed(1)} ${weightUnit}`;
};

// Calculate weight at specific body fat percentage
export const calculateWeightAtBodyFat = (
  height: number, 
  bodyFat: number, 
  gender: 'male' | 'female', 
  unit: 'cm' | 'inches'
): string => {
  // Convert height to meters
  const heightInM = unit === 'cm' ? height / 100 : height * 0.0254;
  
  // BMI reference for calculation
  const bmi = gender === 'male' ? 22.5 : 21.5;
  
  // Calculate lean weight at ideal BMI
  const idealWeight = bmi * heightInM * heightInM;
  
  // Calculate actual weight with current body fat
  const actualWeight = idealWeight / (1 - bodyFat / 100);
  
  // Format output
  const weightUnit = unit === 'cm' ? 'kg' : 'lbs';
  const conversionFactor = unit === 'cm' ? 1 : 2.20462;
  
  return `${(actualWeight * conversionFactor).toFixed(1)} ${weightUnit}`;
};

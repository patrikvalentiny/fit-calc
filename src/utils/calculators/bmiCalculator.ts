export interface BmiParams {
  weight: number;
  height: number;
  unit: 'metric' | 'imperial';
}

export const calculateBmi = ({ weight, height, unit }: BmiParams): number => {
  let bmi: number;
  
  if (unit === 'metric') {
    // BMI formula: weight (kg) / (height (m))²
    const h = height / 100; // Convert cm to meters
    bmi = weight / (h * h);
  } else {
    // BMI formula (imperial): 703 * weight (lbs) / (height (inches))²
    bmi = 703 * weight / (height * height);
  }
  
  return parseFloat(bmi.toFixed(2));
};

export const getBmiCategory = (bmi: number) => {
  if (bmi < 18.5) return { label: 'Underweight', color: 'warning' };
  if (bmi < 25) return { label: 'Normal weight', color: 'success' };
  if (bmi < 30) return { label: 'Overweight', color: 'warning' };
  return { label: 'Obese', color: 'error' };
};

export const getWeightRangeForHeight = (height: number, bmiValue: number, unit: 'metric' | 'imperial'): number => {
  if (unit === 'metric') {
    // Convert cm to meters and calculate
    const heightInMeters = height / 100;
    return Math.round(bmiValue * Math.pow(heightInMeters, 2));
  } else {
    // Imperial formula: BMI * (height in inches)² / 703
    return Math.round(bmiValue * Math.pow(height, 2) / 703);
  }
};

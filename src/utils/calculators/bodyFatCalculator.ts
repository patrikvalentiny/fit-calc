export interface BodyFatParams {
  gender: 'male' | 'female';
  height: number;
  waist: number;
  neck: number;
  hip?: number;
  unit: 'cm' | 'inches';
}

export const calculateBodyFat = ({
  gender,
  height,
  waist,
  neck,
  hip = 0,
  unit
}: BodyFatParams): number => {
  let bodyFatPercentage: number;
  
  if (unit === 'cm') {
    // SI/Metric Units
    if (gender === 'male') {
      // Male formula (Metric): 495/(1.0324 - 0.19077×log10(waist-neck) + 0.15456×log10(height)) - 450
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 
                  0.15456 * Math.log10(height)) - 450;
    } else {
      // Female formula (Metric): 495/(1.29579 - 0.35004×log10(waist+hip-neck) + 0.22100×log10(height)) - 450
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 
                  0.22100 * Math.log10(height)) - 450;
    }
  } else {
    // USC/Imperial Units (inches)
    if (gender === 'male') {
      // Male formula (USC): 86.010×log10(abdomen-neck) - 70.041×log10(height) + 36.76
      bodyFatPercentage = 86.010 * Math.log10(waist - neck) - 
                  70.041 * Math.log10(height) + 36.76;
    } else {
      // Female formula (USC): 163.205×log10(waist+hip-neck) - 97.684×(log10(height)) - 78.387
      bodyFatPercentage = 163.205 * Math.log10(waist + hip - neck) - 
                  97.684 * Math.log10(height) - 78.387;
    }
  }
  
  // Ensure result is within reasonable range (0-60%)
  bodyFatPercentage = Math.max(0, Math.min(60, bodyFatPercentage));
  return parseFloat(bodyFatPercentage.toFixed(1));
};

export const getBodyFatCategory = (bf: number, isMale: boolean) => {
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

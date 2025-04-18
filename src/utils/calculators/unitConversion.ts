// Enhanced version of unit conversion utilities

type ConversionType = 'weight' | 'length';
type UnitType = 'cm' | 'inches' | 'kg' | 'lbs' | 'metric' | 'imperial';

// Main conversion function with support for weight and length
export const convertMeasurement = (
  value: number, 
  fromUnit: UnitType,
  type: ConversionType = 'length'
): number => {
  if (type === 'weight') {
    if (fromUnit === 'kg' || fromUnit === 'metric') {
      // Convert kg to lbs
      return parseFloat((value * 2.20462).toFixed(1));
    } else if (fromUnit === 'lbs' || fromUnit === 'imperial') {
      // Convert lbs to kg
      return parseFloat((value / 2.20462).toFixed(1));
    }
  } else {
    // Length conversion
    if (fromUnit === 'cm' || fromUnit === 'metric') {
      // Convert cm to inches
      return parseFloat((value / 2.54).toFixed(1));
    } else if (fromUnit === 'inches' || fromUnit === 'imperial') {
      // Convert inches to cm
      return parseFloat((value * 2.54).toFixed(1));
    }
  }
  
  // If invalid unit or type, return the original value
  return value;
};

// Legacy functions for backward compatibility
export const convertWeight = (value: number, fromUnit: 'metric' | 'imperial'): number => {
  if (fromUnit === 'metric') {
    // Convert kg to lbs
    return convertMeasurement(value, 'kg', 'weight');
  } else {
    // Convert lbs to kg
    return convertMeasurement(value, 'lbs', 'weight');
  }
};

export const convertHeight = (value: number, fromUnit: 'metric' | 'imperial'): number => {
  if (fromUnit === 'metric') {
    // Convert cm to inches
    return convertMeasurement(value, 'cm');
  } else {
    // Convert inches to cm
    return convertMeasurement(value, 'inches');
  }
};

export const getHeightUnit = (unit: string): string => {
  return unit === 'metric' || unit === 'cm' ? 'cm' : 'inches';
};

export const getWeightUnit = (unit: string): string => {
  return unit === 'metric' || unit === 'cm' ? 'kg' : 'lbs';
};

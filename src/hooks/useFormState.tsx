import { useState, useCallback } from 'react';

interface FormState {
  [key: string]: number | string | boolean;
}

/**
 * Hook to manage form state with validation capabilities
 */
const useFormState = <T extends FormState>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const updateField = useCallback((field: keyof T, value: unknown) => {
    setState(prev => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validate = useCallback((validations: Partial<Record<keyof T, (value: unknown) => string | null>>) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const field in validations) {
      const validator = validations[field];
      if (validator) {
        const error = validator(state[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [state]);

  const resetForm = useCallback(() => {
    setState(initialState);
    setErrors({});
  }, [initialState]);

  return { 
    state, 
    updateField, 
    validate, 
    errors, 
    resetForm 
  };
};

export default useFormState;

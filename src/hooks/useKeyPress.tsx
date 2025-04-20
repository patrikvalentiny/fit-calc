import { useEffect } from 'react';

/**
 * Hook that executes a callback when a specific key is pressed
 */
const useKeyPress = (
  targetKey: string,
  callback: () => void,
  dependencies: unknown[] = [],
  disabled: boolean = false
) => {
  useEffect(() => {
    if (disabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [targetKey, callback, disabled, ...dependencies]);
};

export default useKeyPress;

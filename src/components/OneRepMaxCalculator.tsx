import { useState, useEffect, useRef } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage } from '../utils/localStorage';

const OneRepMaxCalculator = () => {
  const [weight, setWeight] = useState<number | ''>('');
  const [reps, setReps] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formula, setFormula] = useState<string>('brzycki');
  
  // Ref to track if values are already loaded from localStorage
  const valuesLoaded = useRef(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (!valuesLoaded.current) {
      const savedWeight = getFromStorage<number | ''>(STORAGE_KEYS.LIFTING_WEIGHT, '');
      const savedReps = getFromStorage<number | ''>(STORAGE_KEYS.REPS, '');
      const savedFormula = getFromStorage<string>(STORAGE_KEYS.FORMULA, 'brzycki');
      const savedResult = getFromStorage<number | null>(STORAGE_KEYS.ONE_REP_MAX_RESULT, null);
      
      setWeight(savedWeight);
      setReps(savedReps);
      setFormula(savedFormula);
      setResult(savedResult);
      
      valuesLoaded.current = true;
    }
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    if (valuesLoaded.current) {
      saveToStorage(STORAGE_KEYS.LIFTING_WEIGHT, weight);
      saveToStorage(STORAGE_KEYS.REPS, reps);
      saveToStorage(STORAGE_KEYS.FORMULA, formula);
      saveToStorage(STORAGE_KEYS.ONE_REP_MAX_RESULT, result);
    }
  }, [weight, reps, formula, result]);
  
  const calculateOneRepMax = () => {
    if (weight !== '' && reps !== '') {
      setLoading(true);
      setError(null);
      
      try {
        let orm: number;
        const w = weight as number;
        const r = reps as number;
        
        // Calculate 1RM based on selected formula
        switch (formula) {
          case 'brzycki':
            orm = w * (36 / (37 - r));
            break;
          case 'epley':
            orm = w * (1 + 0.0333 * r);
            break;
          case 'lombardi':
            orm = w * Math.pow(r, 0.1);
            break;
          default:
            orm = w * (36 / (37 - r)); // Default to Brzycki
        }
        
        setResult(parseFloat(orm.toFixed(2)));
      } catch (err) {
        setError('Failed to calculate one rep max. Please try again.');
        console.error('1RM calculation error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">One Rep Max Calculator</h2>
      
      <div className="divider">Measurements</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Weight lifted (kg)</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="The weight you lifted for multiple reps">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Enter weight"
            className="input input-bordered input-primary w-full"
            value={weight}
            onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : '')} />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Repetitions</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Number of reps performed with this weight">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Enter reps performed"
            className="input input-bordered input-primary w-full"
            min="1"
            max="36"
            value={reps}
            onChange={(e) => setReps(e.target.value ? parseFloat(e.target.value) : '')} />
        </div>
      </div>

      <div className="form-control w-full mt-4">
        <label className="label">
          <span className="label-text font-medium">Formula</span>
        </label>
        <div className="tabs tabs-boxed flex overflow-x-auto">
          <a
            className={`tab ${formula === 'brzycki' ? 'tab-active' : ''}`}
            onClick={() => setFormula('brzycki')}
          >
            Brzycki
          </a>
          <a
            className={`tab ${formula === 'epley' ? 'tab-active' : ''}`}
            onClick={() => setFormula('epley')}
          >
            Epley
          </a>
          <a
            className={`tab ${formula === 'lombardi' ? 'tab-active' : ''}`}
            onClick={() => setFormula('lombardi')}
          >
            Lombardi
          </a>
        </div>
      </div>

      <div className="text-center mt-3 mb-2">
        <span className="text-xs text-base-content/60 font-mono">
          {formula === 'brzycki'
            ? "1RM = Weight × (36 / (37 - reps))"
            : formula === 'epley'
              ? "1RM = Weight × (1 + 0.0333 × reps)"
              : "1RM = Weight × reps^0.1"}
        </span>
      </div>

      <div className="divider"></div>

      <div className="flex justify-center mt-4">
        <button
          className="btn btn-primary w-full md:btn-wide"
          onClick={calculateOneRepMax}
          disabled={loading || weight === '' || reps === ''}
        >
          {loading ? <span className="loading loading-spinner"></span> : 'Calculate 1RM'}
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

      {result !== null && (
        <div className="mt-6">
          <div className="stats bg-primary text-primary-content shadow w-full flex-col md:flex-row">
            <div className="stat">
              <div className="stat-title text-primary-content/80">Your estimated one rep max</div>
              <div className="stat-value">{result} kg</div>
              <div className="stat-desc text-primary-content/70">Based on {formula} formula</div>
            </div>
          </div>

          <div className="divider">Training Percentages</div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Percentage</th>
                  <th>Weight (kg)</th>
                  <th>Typical Use</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover">
                  <td>95%</td>                  
                  <td className="font-mono">{(result * 0.95).toFixed(1)}</td>
                  <td><span className="badge badge-secondary">2-3 reps</span> Power/Strength</td>
                </tr>
                <tr className="hover">
                  <td>85%</td>
                  <td className="font-mono">{(result * 0.85).toFixed(1)}</td>
                  <td><span className="badge badge-secondary">5-6 reps</span> Strength</td>
                </tr>
                <tr className="hover">
                  <td>75%</td>
                  <td className="font-mono">{(result * 0.75).toFixed(1)}</td>
                  <td><span className="badge badge-secondary">8-10 reps</span> Strength/Hypertrophy</td>
                </tr>
                <tr className="hover">
                  <td>65%</td>
                  <td className="font-mono">{(result * 0.65).toFixed(1)}</td>
                  <td><span className="badge badge-secondary">12-15 reps</span> Hypertrophy/Endurance</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="alert alert-info mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">Training Tip</h3>
              <div className="text-xs">For strength, train with heavier weights (85-95% of 1RM) and lower reps. For muscle size, use moderate weights (65-75% of 1RM) with higher reps.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OneRepMaxCalculator;

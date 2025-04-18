import { useState } from 'react';

const BmiCalculator = () => {
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateBmi = () => {
    if (weight !== '' && height !== '') {
      try {
        setLoading(true);
        setError(null);
        
        // BMI formula: weight (kg) / (height (m))²
        const w = weight as number;
        const h = height as number / 100; // Convert cm to meters
        
        const bmi = w / (h * h);
        setResult(parseFloat(bmi.toFixed(1)));
      } catch (err) {
        console.error('Failed to calculate BMI:', err);
        setError('Failed to calculate BMI. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'warning' };
    if (bmi < 25) return { label: 'Normal weight', color: 'success' };
    if (bmi < 30) return { label: 'Overweight', color: 'warning' };
    return { label: 'Obese', color: 'error' };
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">BMI Calculator</h2>
      
      <div className="divider"></div>
      
      <div className="form-control w-full mx-auto md:max-w-xs">
        <label className="label">
          <span className="label-text font-medium">Weight (kg)</span>
          <span className="label-text-alt">Required</span>
        </label>
        <input
          type="number"
          inputMode="decimal"
          placeholder="Enter weight"
          className="input input-bordered input-primary w-full"
          value={weight}
          onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : '')}
        />
      </div>
      
      <div className="form-control w-full mx-auto md:max-w-xs mt-2">
        <label className="label">
          <span className="label-text font-medium">Height (cm)</span>
          <span className="label-text-alt">Required</span>
        </label>
        <input
          type="number"
          inputMode="decimal"
          placeholder="Enter height"
          className="input input-bordered input-primary w-full"
          value={height}
          onChange={(e) => setHeight(e.target.value ? parseFloat(e.target.value) : '')}
        />
      </div>
      
      <div className="text-center mt-4 mb-2">
        <span className="text-xs text-base-content/60 font-mono">
          BMI = weight (kg) / (height (m))²
        </span>
      </div>
      
      <div className="flex justify-center mt-4">
        <button 
          className="btn btn-primary w-full md:btn-wide" 
          onClick={calculateBmi}
          disabled={loading || weight === '' || height === ''}
        >
          {loading ? <span className="loading loading-spinner"></span> : 'Calculate BMI'}
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
      
      {result !== null && !error && (
        <div className="mt-6">
          <div className="stats bg-primary text-primary-content shadow w-full flex-col md:flex-row">
            <div className="stat">
              <div className="stat-title text-primary-content/80">Your BMI</div>
              <div className="stat-value">{result}</div>
              <div className="stat-desc">
                <span className={`badge badge-${getBmiCategory(result).color} badge-lg mt-1`}>
                  {getBmiCategory(result).label}
                </span>
              </div>
            </div>
          </div>
          
          <div className="collapse collapse-arrow bg-base-200 mt-4">
            <input type="checkbox" defaultChecked /> 
            <div className="collapse-title font-medium">
              What does this mean?
            </div>
            <div className="collapse-content"> 
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>BMI Range</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Less than 18.5</td>
                      <td><span className="badge badge-warning">Underweight</span></td>
                    </tr>
                    <tr>
                      <td>18.5 - 24.9</td>
                      <td><span className="badge badge-success">Normal weight</span></td>
                    </tr>
                    <tr>
                      <td>25 - 29.9</td>
                      <td><span className="badge badge-warning">Overweight</span></td>
                    </tr>
                    <tr>
                      <td>30 or greater</td>
                      <td><span className="badge badge-error">Obese</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="alert alert-info shadow-lg mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">Note</h3>
              <div className="text-xs">BMI is a simple health metric but doesn't account for muscle mass, body composition, age, or other important factors.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BmiCalculator;

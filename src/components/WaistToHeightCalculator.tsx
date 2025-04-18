import { useState } from 'react';

const WaistToHeightCalculator = () => {
  const [waist, setWaist] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<string>('cm');

  const calculateWaistToHeightRatio = () => {
    if (waist !== '' && height !== '') {
      setLoading(true);
      setError(null);
      
      try {
        // Both measurements should be in the same unit, so no conversion needed
        const ratio = (waist as number) / (height as number);
        setResult(parseFloat(ratio.toFixed(2)));
      } catch (err) {
        setError('Failed to calculate waist-to-height ratio. Please try again.');
        console.error('Waist-to-height ratio calculation error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const getRiskCategory = (ratio: number) => {
    if (ratio < 0.4) return { label: 'Underweight possible', color: 'info' };
    if (ratio >= 0.4 && ratio < 0.5) return { label: 'Healthy', color: 'success' };
    if (ratio >= 0.5 && ratio < 0.6) return { label: 'Overweight', color: 'warning' };
    return { label: 'Obese', color: 'error' };
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Waist-to-Height Ratio Calculator</h2>
      
      <div className="divider">Measurements</div>
      
      <div className="form-control w-full mx-auto md:max-w-xs">
        <label className="label">
          <span className="label-text font-medium">Unit of Measurement</span>
        </label>
        <div className="input-group">
          <button 
            className={`btn flex-1 ${unit === 'cm' ? 'btn-active' : ''}`}
            onClick={() => setUnit('cm')}
          >
            Centimeters
          </button>
          <button 
            className={`btn flex-1 ${unit === 'inches' ? 'btn-active' : ''}`}
            onClick={() => setUnit('inches')}
          >
            Inches
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Height ({unit})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure your height without shoes">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter height (${unit})`}
            className="input input-bordered input-primary w-full"
            value={height}
            onChange={(e) => setHeight(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Waist circumference ({unit})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure at the narrowest part of your waist, usually at the level of your belly button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter waist measurement (${unit})`}
            className="input input-bordered input-primary w-full"
            value={waist}
            onChange={(e) => setWaist(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
      </div>
      
      <div className="text-center mt-4 mb-2">
        <span className="text-xs text-base-content/60 font-mono">
          Waist-to-Height Ratio = waist circumference / height
        </span>
      </div>
      
      <div className="flex justify-center mt-4">
        <button 
          className="btn btn-primary w-full md:btn-wide" 
          onClick={calculateWaistToHeightRatio}
          disabled={loading || waist === '' || height === ''}
        >
          {loading ? <span className="loading loading-spinner"></span> : 'Calculate Ratio'}
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
              <div className="stat-title text-primary-content/80">Your waist-to-height ratio</div>
              <div className="stat-value">{result}</div>
              <div className="stat-desc text-primary-content/70">
                <span className={`badge badge-${getRiskCategory(result).color} badge-lg mt-1`}>
                  {getRiskCategory(result).label}
                </span>
              </div>
            </div>
          </div>
          
          <div className="collapse collapse-arrow bg-base-200 mt-4">
            <input type="checkbox" defaultChecked /> 
            <div className="collapse-title font-medium">
              Health Risk Categories
            </div>
            <div className="collapse-content"> 
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Ratio</th>
                      <th>Classification</th>
                      <th>Health Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="badge badge-info">Less than 0.4</span></td>
                      <td>Underweight</td>
                      <td>Low (but other health risks possible)</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-success">0.4 to less than 0.5</span></td>
                      <td>Healthy</td>
                      <td>Lower</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-warning">0.5 to less than 0.6</span></td>
                      <td>Overweight</td>
                      <td>Increased</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-error">0.6 or higher</span></td>
                      <td>Obese</td>
                      <td>High</td>
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
              <h3 className="font-bold">What is Waist-to-Height Ratio?</h3>
              <div className="text-xs">
                Waist-to-height ratio is a simple measurement for assessing health risk based on where you store your body fat. 
                The general guideline is to "keep your waist circumference less than half your height." This applies to both 
                men and women and is considered by some researchers to be more accurate than BMI.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaistToHeightCalculator;

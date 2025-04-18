import { useState } from 'react';
const WaistToHipRatioCalculator = () => {
  const [waist, setWaist] = useState<number | ''>('');
  const [hip, setHip] = useState<number | ''>('');
  const [gender, setGender] = useState<string>('male');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<string>('cm');

  const calculateWaistToHipRatio = () => {
    if (waist !== '' && hip !== '') {
      setLoading(true);
      setError(null);
      
      try {
        // Convert to cm if necessary
        const waistCm = unit === 'inches' ? (waist as number) * 2.54 : waist as number;
        const hipCm = unit === 'inches' ? (hip as number) * 2.54 : hip as number;
        
        // Direct calculation of waist-to-hip ratio
        const ratio = waistCm / hipCm;
        setResult(parseFloat(ratio.toFixed(2)));
      } catch (err) {
        setError('Failed to calculate waist-to-hip ratio. Please try again.');
        console.error('Waist-to-hip ratio calculation error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getRiskCategory = () => {
    if (result === null) return { label: '', color: '' };
    
    if (gender === 'male') {
      if (result < 0.9) return { label: 'Low health risk', color: 'success' };
      if (result >= 0.9 && result <= 0.99) return { label: 'Moderate health risk', color: 'warning' };
      return { label: 'High health risk', color: 'error' };
    } else {
      if (result < 0.8) return { label: 'Low health risk', color: 'success' };
      if (result >= 0.8 && result <= 0.89) return { label: 'Moderate health risk', color: 'warning' };
      return { label: 'High health risk', color: 'error' };
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Waist-to-Hip Ratio Calculator</h2>
      
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
      
      <div className="form-control w-full mx-auto md:max-w-xs mt-4">
        <label className="label">
          <span className="label-text font-medium">Gender</span>
        </label>
        <div className="input-group">
          <button 
            className={`btn flex-1 ${gender === 'male' ? 'btn-active' : ''}`}
            onClick={() => setGender('male')}
          >
            Male
          </button>
          <button 
            className={`btn flex-1 ${gender === 'female' ? 'btn-active' : ''}`}
            onClick={() => setGender('female')}
          >
            Female
          </button>
        </div>
        <label className="label">
          <span className="label-text-alt">Health risk thresholds differ by gender</span>
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Hip circumference ({unit})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure around the widest part of your buttocks">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter hip measurement (${unit})`}
            className="input input-bordered input-primary w-full"
            value={hip}
            onChange={(e) => setHip(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
      </div>
      
      <div className="text-center mt-4 mb-2">
        <span className="text-xs text-base-content/60 font-mono">
          WHR = waist circumference / hip circumference
        </span>
      </div>
      
      <div className="flex justify-center mt-4">
        <button 
          className="btn btn-primary w-full md:btn-wide" 
          onClick={calculateWaistToHipRatio}
          disabled={loading || waist === '' || hip === ''}
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
      
      {result !== null && (
        <div className="mt-6">
          <div className="stats bg-primary text-primary-content shadow w-full flex-col md:flex-row">
            <div className="stat">
              <div className="stat-title text-primary-content/80">Your waist-to-hip ratio</div>
              <div className="stat-value">{result}</div>
              <div className="stat-desc text-primary-content/70">
                <span className={`badge badge-${getRiskCategory().color} badge-lg mt-1`}>
                  {getRiskCategory().label}
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
                      <th>Gender</th>
                      <th>Low Risk</th>
                      <th>Moderate Risk</th>
                      <th>High Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Male</td>
                      <td><span className="badge badge-success">Below 0.90</span></td>
                      <td><span className="badge badge-warning">0.90 - 0.99</span></td>
                      <td><span className="badge badge-error">1.0 or higher</span></td>
                    </tr>
                    <tr>
                      <td>Female</td>
                      <td><span className="badge badge-success">Below 0.80</span></td>
                      <td><span className="badge badge-warning">0.80 - 0.89</span></td>
                      <td><span className="badge badge-error">0.90 or higher</span></td>
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
              <h3 className="font-bold">What is Waist-to-Hip Ratio?</h3>
              <div className="text-xs">Waist-to-hip ratio is a measure of body fat distribution and a predictor of health risk. A higher ratio indicates more fat stored around the waist, which is associated with higher risk of heart disease and type 2 diabetes.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaistToHipRatioCalculator;

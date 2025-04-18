import { useState } from 'react';

const ChestToWaistCalculator = () => {
  const [chest, setChest] = useState<number | ''>('');
  const [waist, setWaist] = useState<number | ''>('');
  const [gender, setGender] = useState<string>('male');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<string>('cm');

  const calculateChestToWaistRatio = () => {
    if (chest !== '' && waist !== '') {
      setLoading(true);
      setError(null);
      
      try {
        // Direct calculation of chest-to-waist ratio
        const ratio = (chest as number) / (waist as number);
        setResult(parseFloat(ratio.toFixed(2)));
      } catch (err) {
        setError('Failed to calculate chest-to-waist ratio. Please try again.');
        console.error('Chest-to-waist ratio calculation error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const getProportionCategory = (ratio: number, isMale: boolean) => {
    if (isMale) {
      if (ratio >= 1.4) return { label: 'Athletic/Bodybuilder', color: 'success' };
      if (ratio >= 1.2) return { label: 'Fit/Average', color: 'info' };
      return { label: 'Below Average', color: 'warning' };
    } else {
      if (ratio >= 1.3) return { label: 'Athletic/Bodybuilder', color: 'success' };
      if (ratio >= 1.15) return { label: 'Fit/Average', color: 'info' };
      return { label: 'Below Average', color: 'warning' };
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Chest-to-Waist Ratio Calculator</h2>
      
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
          <span className="label-text-alt">Ideal ratios differ by gender</span>
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Chest circumference ({unit})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure around the widest part of your chest, across your nipples">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter chest measurement (${unit})`}
            className="input input-bordered input-primary w-full"
            value={chest}
            onChange={(e) => setChest(e.target.value ? parseFloat(e.target.value) : '')}
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
          Chest-to-Waist Ratio = chest circumference / waist circumference
        </span>
      </div>
      
      <div className="flex justify-center mt-4">
        <button 
          className="btn btn-primary w-full md:btn-wide" 
          onClick={calculateChestToWaistRatio}
          disabled={loading || chest === '' || waist === ''}
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
              <div className="stat-title text-primary-content/80">Your chest-to-waist ratio</div>
              <div className="stat-value">{result}</div>
              <div className="stat-desc text-primary-content/70">
                <span className={`badge badge-${getProportionCategory(result, gender === 'male').color} badge-lg mt-1`}>
                  {getProportionCategory(result, gender === 'male').label}
                </span>
              </div>
            </div>
          </div>
          
          <div className="collapse collapse-arrow bg-base-200 mt-4">
            <input type="checkbox" defaultChecked /> 
            <div className="collapse-title font-medium">
              Proportion Categories
            </div>
            <div className="collapse-content"> 
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Men</th>
                      <th>Women</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="badge badge-success">Athletic/Bodybuilder</span></td>
                      <td>1.4 or higher</td>
                      <td>1.3 or higher</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-info">Fit/Average</span></td>
                      <td>1.2 to 1.39</td>
                      <td>1.15 to 1.29</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-warning">Below Average</span></td>
                      <td>Below 1.2</td>
                      <td>Below 1.15</td>
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
              <h3 className="font-bold">What is Chest-to-Waist Ratio?</h3>
              <div className="text-xs">
                The chest-to-waist ratio is a measurement used in fitness and bodybuilding to assess upper body proportions. 
                A higher ratio indicates a more "V-shaped" torso, which is often considered aesthetically pleasing in bodybuilding. 
                This ratio is influenced by both muscle development and body fat distribution.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChestToWaistCalculator;

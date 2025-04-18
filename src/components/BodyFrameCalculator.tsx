import { useState } from 'react';

const BodyFrameCalculator = () => {
  const [wrist, setWrist] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [gender, setGender] = useState<string>('male');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<string>('cm');

  const calculateFrameSize = () => {
    if (wrist !== '' && height !== '') {
      setLoading(true);
      setError(null);
      
      try {
        let frameSize: string;
        const wristValue = unit === 'inches' ? wrist as number : (wrist as number) / 2.54;
        const heightValue = unit === 'inches' ? height as number : (height as number) / 2.54;
        
        // r = height (inches) / wrist circumference (inches)
        const r = heightValue / wristValue;
        
        if (gender === 'male') {
          if (r > 10.4) frameSize = 'Small';
          else if (r >= 9.6 && r <= 10.4) frameSize = 'Medium';
          else frameSize = 'Large';
        } else {
          if (r > 11) frameSize = 'Small';
          else if (r >= 10.1 && r <= 11) frameSize = 'Medium';
          else frameSize = 'Large';
        }
        
        setResult(frameSize);
      } catch (err) {
        setError('Failed to calculate body frame size. Please try again.');
        console.error('Body frame calculation error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const getFrameColor = (frame: string) => {
    switch (frame) {
      case 'Small': return 'info';
      case 'Medium': return 'success';
      case 'Large': return 'warning';
      default: return '';
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Body Frame Size Calculator</h2>
      
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
          <span className="label-text-alt">Frame size thresholds differ by gender</span>
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
            <span className="label-text font-medium">Wrist circumference ({unit})</span>
            <span className="label-text-alt">
              <div className="tooltip" data-tip="Measure around the smallest part of your wrist">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Enter wrist measurement (${unit})`}
            className="input input-bordered input-primary w-full"
            value={wrist}
            onChange={(e) => setWrist(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
      </div>
      
      <div className="text-center mt-4 mb-2">
        <span className="text-xs text-base-content/60 font-mono">
          Body Frame Size = height / wrist circumference
        </span>
      </div>
      
      <div className="flex justify-center mt-4">
        <button 
          className="btn btn-primary w-full md:btn-wide" 
          onClick={calculateFrameSize}
          disabled={loading || wrist === '' || height === ''}
        >
          {loading ? <span className="loading loading-spinner"></span> : 'Calculate Frame Size'}
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
              <div className="stat-title text-primary-content/80">Your body frame size</div>
              <div className="stat-value">{result}</div>
              <div className="stat-desc text-primary-content/70">
                <span className={`badge badge-${getFrameColor(result)} badge-lg mt-1`}>
                  {result} Frame
                </span>
              </div>
            </div>
          </div>
          
          <div className="collapse collapse-arrow bg-base-200 mt-4">
            <input type="checkbox" defaultChecked /> 
            <div className="collapse-title font-medium">
              Body Frame Size Categories
            </div>
            <div className="collapse-content"> 
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Body Frame</th>
                      <th>Males (r = H/W)</th>
                      <th>Females (r = H/W)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="badge badge-info">Small</span></td>
                      <td>r &gt; 10.4</td>
                      <td>r &gt; 11.0</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-success">Medium</span></td>
                      <td>9.6 &lt;= r &lt;= 10.4</td>
                      <td>10.1 &lt;= r &lt;= 11.0</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-warning">Large</span></td>
                      <td>r &lt; 9.6</td>
                      <td>r &lt; 10.1</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-xs mt-2">
                  Note: r = Height in inches / Wrist circumference in inches
                </div>
              </div>
            </div>
          </div>
          
          <div className="alert alert-info shadow-lg mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">What is Body Frame Size?</h3>
              <div className="text-xs">
                Body frame size refers to the bone structure of a person and is typically categorized as small, medium, or large. 
                Knowing your frame size can help you better understand your body type and set more realistic fitness goals. 
                Your frame size can also affect ideal weight calculations and body composition assessments.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyFrameCalculator;

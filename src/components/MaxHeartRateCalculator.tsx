import { useState } from 'react';

const MaxHeartRateCalculator = () => {
  const [age, setAge] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);
  const [zones, setZones] = useState<{min: number, max: number, name: string, description: string}[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formula, setFormula] = useState<string>('traditional');

  const calculateMaxHeartRate = () => {
    if (age !== '') {
      // Show loading state
      setLoading(true);
      setError(null);
      
      try {
        // Direct calculation based on selected formula
        let mhr: number;
        if (formula === 'traditional') {
          mhr = 220 - (age as number);
        } else { // Tanaka formula
          mhr = 208 - (0.7 * (age as number));
        }
        
        // Round to the nearest whole number
        mhr = Math.round(mhr);
        setResult(mhr);
        
        // Calculate heart rate zones
        setZones([
          { 
            min: Math.round(mhr * 0.5), 
            max: Math.round(mhr * 0.6),
            name: "Zone 1 - Recovery",
            description: "Very light activity, helps recovery"
          },
          { 
            min: Math.round(mhr * 0.6), 
            max: Math.round(mhr * 0.7),
            name: "Zone 2 - Aerobic",
            description: "Light exercise, improves general endurance"
          },
          { 
            min: Math.round(mhr * 0.7), 
            max: Math.round(mhr * 0.8),
            name: "Zone 3 - Endurance",
            description: "Moderate exercise, improves aerobic fitness"
          },
          { 
            min: Math.round(mhr * 0.8), 
            max: Math.round(mhr * 0.9),
            name: "Zone 4 - Threshold",
            description: "Hard exercise, increases maximum performance"
          },
          { 
            min: Math.round(mhr * 0.9), 
            max: Math.round(mhr),
            name: "Zone 5 - Anaerobic",
            description: "Maximum effort, enhances sprint performance"
          }
        ]);
      } catch (err) {
        setError('Failed to calculate maximum heart rate. Please try again.');
        console.error('Max heart rate calculation error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Get zone color based on intensity
  const getZoneColor = (index: number): string => {
    const colors = ["success", "info", "warning", "error", "secondary"];
    return colors[index] || "primary";
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Maximum Heart Rate Calculator</h2>
      
      <div className="divider">Input Your Age</div>
      
      <div className="form-control w-full mx-auto md:max-w-xs">
        <label className="label">
          <span className="label-text font-medium">Age (years)</span>
          <span className="label-text-alt">Required</span>
        </label>
        <input
          type="number"
          inputMode="decimal"
          placeholder="Enter your age"
          className="input input-bordered input-primary w-full"
          value={age}
          onChange={(e) => setAge(e.target.value ? parseFloat(e.target.value) : '')}
        />
      </div>
      
      <div className="form-control w-full mx-auto md:max-w-xs mt-2">
        <label className="label">
          <span className="label-text font-medium">Formula</span>
        </label>
        <div className="tabs tabs-boxed">
          <a 
            className={`tab ${formula === 'traditional' ? 'tab-active' : ''}`}
            onClick={() => setFormula('traditional')}
          >
            Traditional (220-age)
          </a>
          <a 
            className={`tab ${formula === 'tanaka' ? 'tab-active' : ''}`}
            onClick={() => setFormula('tanaka')}
          >
            Tanaka
          </a>
        </div>
      </div>
      
      <div className="text-center mt-3 mb-2">
        <span className="text-xs text-base-content/60 font-mono">
          {formula === 'traditional' 
            ? "MHR = 220 - age" 
            : "MHR = 208 - (0.7 × age)"}
        </span>
      </div>
      
      <div className="flex justify-center mt-4">
        <button 
          className="btn btn-primary w-full md:btn-wide" 
          onClick={calculateMaxHeartRate}
          disabled={age === '' || loading}
        >
          {loading ? <span className="loading loading-spinner"></span> : 'Calculate Max Heart Rate'}
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
      
      {result !== null && !loading && (
        <div className="mt-6">
          <div className="stats bg-primary text-primary-content shadow w-full flex-col md:flex-row">
            <div className="stat">
              <div className="stat-title text-primary-content/80">Your estimated maximum heart rate</div>
              <div className="stat-value">{result} bpm</div>
              <div className="stat-desc text-primary-content/70">Based on {formula === 'traditional' ? '220-age' : 'Tanaka'} formula</div>
            </div>
          </div>
          
          {zones && (
            <div className="mt-6">
              <div className="divider">HEART RATE ZONES</div>
              
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {zones.map((zone, index) => (
                  <div key={index} className="tooltip" data-tip={zone.description}>
                    <div className={`radial-progress text-${getZoneColor(index)} border-4`} style={{ "--value": ((index + 1) * 20), "--size": "4rem" } as React.CSSProperties}>
                      <span className="text-lg font-bold">{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="collapse collapse-arrow bg-base-200 mt-4">
                <input type="checkbox" defaultChecked /> 
                <div className="collapse-title font-medium">
                  Heart Rate Zone Details
                </div>
                <div className="collapse-content"> 
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Zone</th>
                          <th>BPM Range</th>
                          <th>Name</th>
                          <th className="hidden md:table-cell">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {zones.map((zone, index) => (
                          <tr key={index} className="hover">
                            <td>
                              <div className={`badge badge-${getZoneColor(index)} badge-lg`}>{index + 1}</div>
                            </td>
                            <td className="font-mono">{zone.min}-{zone.max} bpm</td>
                            <td>{zone.name}</td>
                            <td className="hidden md:table-cell">{zone.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="alert alert-info mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 className="font-bold">Training Tips</h3>
                  <div className="text-xs">
                    Train in different heart rate zones to optimize your cardiovascular fitness. 
                    Lower zones (1-2) are best for endurance, while higher zones (4-5) are for improving anaerobic capacity.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MaxHeartRateCalculator;

import { useState } from 'react';

const BmrCalculator = () => {
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<string>('male');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activityLevel, setActivityLevel] = useState<number>(1.2);

  const calculateBmr = () => {
    if (weight !== '' && height !== '' && age !== '') {
      setLoading(true);
      setError(null);
      
      try {
        // Calculate BMR using Mifflin-St Jeor Equation
        const w = weight as number;
        const h = height as number;
        const a = age as number;
        
        let bmr: number;
        if (gender === 'male') {
          bmr = 10 * w + 6.25 * h - 5 * a + 5;
        } else {
          bmr = 10 * w + 6.25 * h - 5 * a - 161;
        }
        
        setResult(bmr);
      } catch (err) {
        setError('Failed to calculate BMR. Please try again.');
        console.error('BMR calculation error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getActivityLevelLabel = () => {
    const levels = {
      1.2: "Sedentary (little or no exercise)",
      1.375: "Lightly active (light exercise 1-3 days/week)",
      1.55: "Moderately active (moderate exercise 3-5 days/week)",
      1.725: "Very active (hard exercise 6-7 days/week)",
      1.9: "Extra active (very hard exercise & physical job)"
    };
    return levels[activityLevel as keyof typeof levels];
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Basal Metabolic Rate Calculator</h2>
      
      <div className="divider">Your Details</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Weight (kg)</span>
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
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Height (cm)</span>
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
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Age (years)</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Enter age"
            className="input input-bordered input-primary w-full"
            value={age}
            onChange={(e) => setAge(e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>
        
        <div className="form-control w-full">
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
        </div>
      </div>
      
      <div className="text-center mt-4 mb-0">
        <span className="text-xs text-base-content/60 font-mono">
          {gender === 'male' 
            ? "BMR = 10×weight + 6.25×height - 5×age + 5" 
            : "BMR = 10×weight + 6.25×height - 5×age - 161"}
        </span>
      </div>
      
      <div className="divider">Activity Level</div>
      
      <div className="form-control w-full px-2">
        <input 
          type="range" 
          min="1.2" 
          max="1.9" 
          value={activityLevel} 
          step="0.175"
          className="range range-primary w-full" 
          onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
        />
        <div className="w-full flex justify-between text-xs px-1 mt-2">
          <span>Sedentary</span>
          <span className="text-center">Light</span>
          <span className="text-center">Moderate</span>
          <span className="text-center">Very</span>
          <span>Extra active</span>
        </div>
        <label className="label">
          <span className="label-text-alt text-center w-full">{getActivityLevelLabel()}</span>
        </label>
      </div>
      
      <div className="flex justify-center mt-6">
        <button 
          className="btn btn-primary w-full md:btn-wide" 
          onClick={calculateBmr}
          disabled={loading || weight === '' || height === '' || age === ''}
        >
          {loading ? <span className="loading loading-spinner"></span> : 'Calculate BMR'}
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
          <div className="stats shadow bg-primary text-primary-content w-full flex-col md:flex-row">
            <div className="stat">
              <div className="stat-title text-primary-content/80">Your BMR</div>
              <div className="stat-value">{result.toFixed(0)}</div>
              <div className="stat-desc text-primary-content/70">calories/day</div>
            </div>
            
            {activityLevel > 1.2 && (
              <div className="stat">
                <div className="stat-title text-primary-content/80">Daily Calorie Need</div>
                <div className="stat-value">{(result * activityLevel).toFixed(0)}</div>
                <div className="stat-desc text-primary-content/70">calories/day with activity</div>
              </div>
            )}
          </div>
          
          <div className="alert alert-info shadow-lg mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">What is BMR?</h3>
              <div className="text-xs">Basal Metabolic Rate is the number of calories your body needs at complete rest to maintain vital functions.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BmrCalculator;

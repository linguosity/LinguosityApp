import { useState } from "react";

const steps = [
  { 
    title: 'step 1', 
    content: 
      'this is the step 1'
  },

  { 
    title: 'step 2', 
    content: 'this is the step 2' 
  },

  { 
    title: 'step 3', 
    content: 'this is the step 3' 
  },

  { 
    title: 'step 4', 
    content: 'this is the step 4' 
  },
]

const OnboardingScreen = ({ onClose }) => {
  const [onboardStep, setOnboardStep] = useState(0)

  const onNext = () => setOnboardStep(prev => prev === 3 ? 0 : prev + 1)
  return (
    <div className="onboarding-overlay">
      <div className="onboarding-content">
        <h2>Welcome to Linguosity</h2>
        <div>
          <p>{steps[onboardStep].content}</p>
        </div>
        <div className="onboarding-toolbar">
          <button onClick={onClose}>Close</button>
          <div className="status-circles">
            <div className={onboardStep === 0 ? "circle active" : "circle"} onClick={() => setOnboardStep(0)}></div>
            <div className={onboardStep === 1 ? "circle active" : "circle"} onClick={() => setOnboardStep(1)}></div>
            <div className={onboardStep === 2 ? "circle active" : "circle"} onClick={() => setOnboardStep(2)}></div>
            <div className={onboardStep === 3 ? "circle active" : "circle"} onClick={() => setOnboardStep(3)}></div>
          </div>
          <button onClick={onNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;

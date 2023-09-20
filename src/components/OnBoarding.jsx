import { useState } from "react";
import laptopVisual from '../assets/laptop-visual.png';
import aiBook from '../assets/ai-book.gif';


const steps = [
  {
    title: 'Welcome to Linguosity',
    content: (
      <div>
        <img src={laptopVisual} alt="Robot Learning" />
        <p>Discover the future of personalized language education through AI-generated stories and mini-lessons.</p>
        
      </div>
    )
  },
  {
    title: 'Language & Voice',
    content: (
      <div>
        <h3>Select Your Language</h3>
        <p>Choose from over 140 languages, and experience the lesson with text-to-voice functionality.</p>
      </div>
    )
  },
  {
    title: 'Customize Your Story',
    content: (
      <div>
        <h3>Topic, Genre, and Length</h3>
        <p>Personalize your learning by selecting the topic, genre, and length of your story.</p>
      </div>
    )
  },
  {
    title: 'Vocabulary Targets',
    content: (
      <div>
        <h3>Targeted Vocabulary</h3>
        <p>Set your vocabulary targets to ensure your lesson is aligned with your learning objectives.</p>
      </div>
    )
  },
  {
    title: 'Interactive Experience',
    content: (
      <div>
        <h3>Dynamic Lessons</h3>
        <p>Engage with mini-lessons that offer warm-up prep and post-reading questions for a comprehensive learning experience.</p>
      </div>
    )
  },
  {
    title: 'Save & Share',
    content: (
      <div>
        <h3>Convenient Formats</h3>
        <p>Save your stories as PDFs or MP3 audio files for easy sharing and offline access.</p>
      </div>
    )
  }, 
  {
    title: 'Solve Real Problems',
    content: (
      <div>
        <h3>Tired of Impersonal Content and Wasting Time?</h3>
        <p>Linguosity's adaptive learning strategies cater to individual needs, saving you time and making learning more effective.</p>
        <img src="pain-point-graphic.png" alt="Pain Point Graphic" />
      </div>
    ),
  }
]

const OnboardingScreen = ({ onClose }) => {
  const [onboardStep, setOnboardStep] = useState(0)

  const onNext = () => setOnboardStep(prev => prev === steps.length - 1 ? 0 : prev + 1)
  const onPrevious = () => setOnboardStep(prev => prev === 0 ? steps.length - 1 : prev - 1)
  
  return (
    <div className="onboarding-overlay">
      <div className="onboarding-content">
        <h2>Linguosity</h2>
        <span>Your AIde to language fluency</span>
        <img src={aiBook} alt="AI Book" width="25%" className="aiBook"></img>
        <button onClick={onPrevious} className="clickLeft"> {"<"}</button>  {/* Changed text to "Previous" */}
        <div>
          <p>{steps[onboardStep].content}</p>
        </div>
        <button onClick={onNext} className="clickRight"> {">"} </button>
        <div className="onboarding-toolbar">
          
          <div className="status-circles">
            {steps.map((_, index) => (
              <div 
                className={onboardStep === index ? "circle active" : "circle"} 
                onClick={() => setOnboardStep(index)}
                key={index}
              >
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;

import { useState, useEffect, useRef } from "react";
import laptopVisual from '../assets/laptop-visual-2.png';
import aiBook from '../assets/ai-book.gif';
import mp3File from '../assets/mp3-file.png';
import pdfFile from '../assets/save-as-pdf.png';
import language from '../assets/language.png';
import topic from '../assets/topic.png';
import comicBook from '../assets/comic-book.png';
import storyTelling from '../assets/story-telling.png';
import difficulty from '../assets/difficulty.png';
import generateStory from '../assets/story-writer.gif';
import generateQuestions from '../assets/generate-questions.gif';
import Tabs from "./Tabs";


const OnboardingScreen = ({ onClose }) => {
  const [onboardStep, setOnboardStep] = useState(0);
  const onNext = () => setOnboardStep(prev => prev === steps.length - 1 ? 0 : prev + 1);
  const onPrevious = () => setOnboardStep(prev => prev === 0 ? steps.length - 1 : prev - 1);
  const [activeTab, setActiveTab] = useState('pre_reading');

const steps = [
  {
    title: 'Welcome to Linguosity',
    content: (
      <>
        <div className="welcome-header">
          <div className="logo-name-wrap">
            <img src="https://uploads-ssl.webflow.com/643f1edf85eba707f45ddfc3/646255f5e004cd49868bd0df_linguosity_logo.svg" alt="Linguosity logo" className="nav-logo-wrap"/>
            <h2>Linguosity</h2>
          </div>
          <p>Your <span>AI</span>de to language fluency</p>
        </div>
        <img src={laptopVisual} alt="Robot Learning" className="laptop-gif" />
        <p>Discover the future of personalized language education through <span>AI-generated</span> stories and mini-lessons.</p>
      </>
      
    )
  },
  {
    title: 'Customize your narrative',
    content: (
      <>
        <div className="selectPreferences">
          
              <ul></ul>
                <li>Write stories in <span>140 languages</span> <img src={language} alt="AI Book"></img></li>
                <li>any <span>topic</span> <img src={topic} alt="AI Book"></img></li>
                <li><span>genre</span> <img src={comicBook} alt="AI Book"></img></li>
                <li>and <span>difficulty</span> level <img src={difficulty} alt="AI Book" width="25%"></img></li>
                <p></p>
            
        </div>
      </>
    )
  },
  {
    title: 'Vocabulary Targets',
    content: (
      <div className="vocab-box">
        <h3>Targeted Vocabulary</h3>
        <div id="simulatedInput" className="simulatedInput">
          <span id="textContainer"></span>
          <span className="cursor"></span>
        </div>

        <p>Embed specific or general vocabulary to practice in context</p>
      </div>
    )
  },
  { title: 'Interactive Experience',
  content: (
    <div className="bonus-features">
    
      {/* Here we include the Tabs component */}
      <Tabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        story_text= {
          "Once upon a time, three sibling pigs decided to build homes. " +
          "Eldest pig, Henry, chose straw. 'It's eco-friendly,' he said. " +
          "Middle pig, Eliza, picked sticks. 'Recyclable,' she reasoned. " +
          "Youngest, Liam, opted for bricks. 'Sturdy and sustainable,' he explained. " +
          "Soon, a cunning wolf arrived. He huffed at Henry's straw house, promptly demolishing it. " +
          "Henry dashed to Eliza's stick abode. The wolf huffed again, reducing it to debris. " +
          "Both fled to Liam's brick haven. The wolf huffed and puffed, but the house stood firm. " +
          "'A lesson in resilience,' Liam declared. Together, they outwitted the wolf, living wisely ever after."
        }
        pre_reading = {
          `"Anticipation Guide\n1. Are bricks better than wood for building a house? Why or why not? \n 2. Is it wise to take the time to prepare and build something strong, or is it better to finish quickly? \n 3. Family should always stick together in times of crisis. True or False. \nGlossary\n1. Sibling: A brother or sister.\n2. Eco-friendly: Good for the environment.\n3. Recyclable: Capable of being reused.`
        }
        post_reading = {`Comprehension questions
        1. Why did each pig choose their respective building material?
        2. How did the wolf manage to destroy the first two houses?
        3. What makes Liam's house different from the others?`
      }
      />

      <p><span>Prep</span> your brain to best understand the story, then <span>recap</span> the details after reading to cement your learning</p>
    </div>
  )
  },
  {
    title: 'Save & Share',
    content: (
      <div>
        <img src={pdfFile} alt="Robot Learning" className="saveIcons" /><img src={mp3File} alt="Robot Learning" className="saveIcons" />

        <p>Save your stories as PDFs or MP3 audio files for easy sharing and offline access.</p>
      </div>
    )
  }, 
  {
    title: 'Solve Real Problems',
    content: (
      <div>
        <h3>Start Now</h3>
        <p> Kickstart your language learning now with a trial perioddfs</p>
        <img src="pain-point-graphic.png" alt="Pain Point Graphic" />
      </div>
    ),
  }
]

  
  useEffect(() => {
    const textsToType = [
      'basic cooking vocabulary', 
      'words that start with "r"', 
      'irregular past tense verbs like "ran" or "sat"',
      'synonyms for "quick"',
      '"abolish", "escalate", "investigate", "extend", "gigantic"'
    ];

    let arrayIndex = 0;
    let charIndex = 0;
    let isErasing = false;
    let timeoutId = null;
  
    function typeText() {
      const textContainer = document.getElementById('textContainer');
      if (textContainer && !isErasing) {
        const currentText = textsToType[arrayIndex];
        if (charIndex < currentText.length) {
          textContainer.innerHTML += currentText.charAt(charIndex);
          charIndex++;
          timeoutId = setTimeout(typeText, 40);
        } else {
          isErasing = true;
          timeoutId = setTimeout(eraseText, 2000);
        }
      }
    }
  
    function eraseText() {
      const textContainer = document.getElementById('textContainer');
      if (textContainer && isErasing) {
        if (charIndex > 0) {
          textContainer.innerHTML = textContainer.innerHTML.slice(0, -1);
          charIndex--;
          timeoutId = setTimeout(eraseText, 100);
        } else {
          isErasing = false;
          arrayIndex = (arrayIndex + 1) % textsToType.length;
          timeoutId = setTimeout(typeText, 1000);
        }
      }
    }
  
    if (onboardStep === 2) {
      typeText();
    } else {
      // Clear the ongoing timeout and reset variables when user swipes away
      clearTimeout(timeoutId);
      charIndex = 0;
      arrayIndex = 0;
      isErasing = false;
      const textContainer = document.getElementById('textContainer');
      if (textContainer) {
        textContainer.innerHTML = "";
      }
    }
  }, [onboardStep]);
  
  
  
  return (
    <div className="onboarding-overlay">
      <div className="onboarding-content">
        
        
        <button onClick={onPrevious} className="clickLeft"> {"<"}</button>  {/* Changed text to "Previous" */}
        
          <div className="onBoardSteps">{steps[onboardStep].content}</div>
        
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

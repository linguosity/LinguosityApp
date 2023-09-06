import React, { useState, useRef, useMemo } from 'react';
import Tabs from './components/Tabs';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, InputToolbox } from "@chatscope/chat-ui-kit-react"
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useFirebaseAuth } from './context/FirebaseContext';
import AuthComponent from './components/AuthComponent';
import ParamsForm from './components/ParamsForm';
import Modal from './components/Modal';
import useShow from './hooks/useShow';
import getWordsCount from './utils/getWordsCount';
import Logo from './components/Logo';
import getVoiceID from './utils/getVoiceID';
import callOpenAI from './lib/callOpenAI';
import Sidenav from './components/Sidenav';
import ReactPDF, { PDFDownloadLink } from '@react-pdf/renderer'
import MyDocument from './components/MyDocument';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { useAudioMagnament } from './context/AudioMagnament';
import { Box } from 'grommet';
//import AzureTTSComponent from './AzureTTSComponent';

const OnboardingScreen = ({ lottieData, heading, paragraph, onNext, onPrev, onSkip }) => {
  return (
    <div className="onboarding-screen">
      <div className="lottie-container">
        {/* Insert Lottie component here with lottieData */}
      </div>
      <h2>{heading}</h2>
      <p>{paragraph}</p>
      <div className="navigation">
        <button onClick={onPrev}>{"<"}</button>
        <button onClick={onNext}>{">"}</button>
      </div>
      <button className="skip" onClick={onSkip}>Skip</button>
    </div>
  );
};

const Onboarding = () => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const onNext = () => setCurrentScreen(prev => prev + 1);
  const onPrev = () => setCurrentScreen(prev => prev - 1);
  const onSkip = () => {/* Remove onboarding component */ };

  const screensData = [
    { lottieData: {/*...*/ }, heading: "Step 1", paragraph: "Step 1 Description" },
    // ... more screens
  ];

  const { lottieData, heading, paragraph } = screensData[currentScreen];

  return (
    <OnboardingScreen
      lottieData={lottieData}
      heading={heading}
      paragraph={paragraph}
      onNext={onNext}
      onPrev={onPrev}
      onSkip={onSkip}
    />
  );
};

const formDataDefault = {
  story_topic: '',
  story_length: '',
  reading_difficulty_level: '',
  story_genre: '',
  lesson_objectives: '',
  target_language: '',
};

function App() {

  const [messages, setMessages] = useState([])
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [preReadingActivity, setPreReadingActivity] = useState('');
  const [postReadingActivity, setPostReadingActivity] = useState('');
  const [formData, setFormData] = useState(formDataDefault);
  const { show, open, close, toggle } = useShow()
  const modalRef = useRef()
  const { user } = useFirebaseAuth()
  const { setVoiceID } = useAudioMagnament()
  const resetForm = () => setFormData(formDataDefault)
  const [showOnboarding, setShowOnboarding] = useState(true);


  const handleSend = async (content) => {
    setIsTyping(true);
    const systemMsg = {
      role: "system",
      content: `You are tasked with guiding the user through a story they provide. Your role is to facilitate engagement and understanding of the story.

To begin our storytelling adventure. Give a comment as funny about the history that you have provided. As introduction

Give to ther user options based on story:

Scene Example One
Scene Example Two
Character Example One
Character Example Two
(And so on, based on the user's story)
And might you want add some question to the user.
You must wait the user response to continue


Exploration and Engagement:
As we embark on this narrative journey, you can expect engaging questions and prompts to help us dive deeper into your story:

"As we immerse ourselves in your story, please describe the current scene or setting. What vivid imagery do you associate with this part of the story?"

"Let's delve into your characters. Share insights into their motivations, personalities, or any significant character development in this part of the story."

"Are there specific themes, emotions, or messages you'd like to explore in this section of your story? Your input enriches our discussion."

Reflecting on the Story:
We'll also take moments to reflect on your story's impact:

"Throughout our journey, consider the broader messages or lessons in your story. How do the characters' experiences resonate with real-life situations or personal insights?"

"Do you have questions or themes you'd like to delve into further as we continue exploring your narrative? Feel free to share your thoughts and questions."

Conclusion:
To conclude, we're here to enhance your storytelling experience:

This revised prompt system is designed to create a welcoming and engaging atmosphere as the user shares their story and explores it further with the AI system.`
    }
    const newMessage = {
      role: "user",
      content
    }


    setMessages(prev => {
      if (!prev.length > 0) {
        return prev
      } else {
        return [...prev, newMessage]
      }
    });

    const result = await callOpenAI([systemMsg, newMessage], undefined, 0.1);

    if (!result) {
      setIsTyping(false);
      return
    } else {
      console.log(result.message)
      setMessages(prev => [...prev, result.message]);
      setIsTyping(false);

    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()

    const data = { ...formData, story_length: `${getWordsCount(formData.story_length)} words` }

    const retrievedVoiceID = getVoiceID(data.target_language);
    setVoiceID(retrievedVoiceID);


    const messages = [
      {
        role: "system",
        content: `Objective:
According to the parameters provided by the user, your task is to create an engaging narrative in the user's target language to aid language acquisition. Adhere to the user-specified parameters, including different levels of reading difficulty. Please ensure the story has a title formatted as "TITLE: <history title>."

User Input Example:

json
{
  "story_topic": "An history of hobbits",
  "story_length": "500 words",
  "reading_difficulty_level": "Beginner",
  "story_genre": "Fiction",
  "lesson_objectives": "attention",
  "target_language": "English (US)"
}

Parameters:

Story Topic: Una historia de hobbits como la película
Story Length: 500 words
Reading Difficulty Level: Beginner
Story Genre: Fiction
Lesson Objectives: Attention
Target Language: Spanish (US)
Reading Difficulty Levels:

Beginner: Low TTR, BICS Language, Heaps Narrative Structure, Simple Sentences, No Dialogue
Early Intermediate: Low-Moderate TTR, Transition from BICS to CALP Language, Protonarrative Structure, Simple and Some Compound Sentences, No Dialogue
Intermediate: High-Moderate TTR, CALP Language, Linear Narrative Structure, Mixture of Compound and Simple Sentences, Minimal One-Sided Dialogue
Advanced: High TTR, Advanced CALP Language, Chronological Narrative Structure, Complex Sentences with Embedded Clauses, Brief One-Sided Dialogue
Proficient: Very High TTR, Advanced CALP with Literary Elements, Classic Narrative Structure, Complex Sentences with Multiple Embedded Clauses, Extensive Two-Sided Dialogue
Mastery: Extremely High TTR, Advanced CALP with Academic and Literary Elements, Literary Narrative Structure, Highly Complex Sentences with Literary Devices, Rich and Nuanced Dialogue
Instructions for Generating the Story:

Create an immersive narrative in target_language according to the specified parameters. Ensure that the story aligns with the "story_length" parameter provided by the user.

Based on the user's request for a beginner-level story, use simple sentences, basic vocabulary, and a straightforward narrative structure.

Follow the genre of fiction and focus on the lesson objective of capturing the reader's attention.

Include a title for the story formatted as "TITLE: <history title>."

Tailor the language to the target language specified by the user, which is "target_language" in this case.

By following these instructions, you will create a language learning narrative that meets the user's specific requirements for difficulty level and content.`},
      {
        role: "user",
        content: "Write me a story, pre-reading guide and post-reading questions based on the following parameters paying careful attention to each:" + JSON.stringify(data)
      }
    ]

    const functions = [
      {
        name: 'write_story_activities',
        description: 'generates a complete story, story_text, given set parameters and pre-reading and post-reading guides. Only return story_text, pre_reading and post_reading as a JSON object enclosed in curly braces with appropriate formatting.',

        parameters: {
          type: 'object',

          properties: {
            story_text: {
              type: 'string',
              description: 'a complete narrative with a story title based on parameters provided by the user: educational_objectives, target_language, story_text, story_genre, reading_difficulty_level, story_length, story_topic'
            },

            pre_reading: {
              type: 'string',
              description: 'Anticipation guide and glossary of key vocabulary with definitions to prepare the reader for the narrative.'
            },
            post_reading: {
              type: 'string',
              description: 'Post-reading comprehension questions based on Blooms taxonomy to evaluate the reader comprehension.'
            }

          },
          required: ['story_text', 'pre_reading', 'post_reading']
        }
      }
    ]

    setIsLoading(true);
    close()

    const result = await callOpenAI(messages, functions, 0)

    if (!result) {
      setIsLoading(false)
      return
    }
    const rawArguments = result.message.function_call.arguments;
    console.log('rawArguments', rawArguments)
    const sanitizedArguments = rawArguments.replace(/[\u0000-\u0019]+/g, "");
    const functionArguments = JSON.parse(sanitizedArguments);

    console.log(functionArguments.story_text);
    console.log(functionArguments.pre_reading);
    console.log(functionArguments.post_reading);
    handleSend(sanitizedArguments)
    setPreReadingActivity(functionArguments.pre_reading);
    setPostReadingActivity(functionArguments.post_reading);
    setStoryText(functionArguments.story_text);
    setIsLoading(false)
    resetForm()
    console.log('final')

  }

  const documentIsReady = useMemo(() => {
    return !!(storyText !== "" && preReadingActivity !== "" && postReadingActivity !== "")
  }, [
    storyText,
    preReadingActivity,
    postReadingActivity
  ])


  return (
    <div>
      {/* <Header /> */}
      {/* {
        user ? ( */}
      <div className="app-container">
        <Sidenav
          story={story}
          toggleForm={toggle}
          pdfDocument={
            documentIsReady ?
              <MyDocument pages={[
                storyText,
                preReadingActivity,
                postReadingActivity
              ]} /> : undefined
          }
        />
        <div className="right-column">
          <MainContainer >
            {showOnboarding && <Onboarding onSkip={() => setShowOnboarding(false)} />}
            <ChatContainer>
              <MessageList typingIndicator={isTyping ? <TypingIndicator content="" /> : null} >
                {messages.map((message, i) => {
                  return <Message key={i} model={{
                    direction: message.role === "user" ? "outgoing" : "incoming",
                    message: message.content
                  }} />
                })}
              </MessageList>
              <MessageInput placeholder='Type message here' onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
          {show && (
            <Modal target={modalRef} isOpen={open} onClose={close} position='left'>
              <ParamsForm
                formData={formData}
                setFormData={setFormData}
                onReset={resetForm}
                onSubmit={handleGenerate}
              />
            </Modal>
          )}
        </div>
        <div className={`tab-wrapper ${isLoading ? 'loading' : ''}`}>
          <div className="tab-shadow">
            <Tabs
              story_text={storyText}
              pre_reading={preReadingActivity}
              post_reading={postReadingActivity}
            />
          </div>
        </div>
        {isLoading && <Logo />}
      </div>)
      {/* // :
          // <AuthComponent />
      } */}
      {/* <Footer story={story} /> */}
    </div>

  );
}

export default App;


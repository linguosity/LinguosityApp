import React, { useState, useRef, useMemo, useContext } from 'react';
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
import { Box, Grommet, ResponsiveContext } from 'grommet';
//import AzureTTSComponent from './AzureTTSComponent';
import OnboardingScreen from './components/OnBoarding';


const formDataDefault = {
  story_topic: '',
  story_length: '',
  reading_difficulty_level: '',
  story_genre: '',
  lesson_objectives: '',
  target_language: '',
};
function extractAndParseButtons(input) {
  const regex = /buttons=\[(.*?)\]/;
  const match = input.match(regex);
  if (match && match[1]) {
    try {
      const buttonsArray = JSON.parse(`[${match[1]}]`);
      const replacedInput = input.replace(match[0], ''); // Reemplazar toda la coincidencia, incluyendo 'buttons=[...]'

      return {
        buttons: buttonsArray,
        replacedInput: replacedInput
      };
    } catch (error) {
      console.error('Error al analizar el array de botones:', error);
    }
  }

  return null;
}


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
  const { setVoiceID, setAudioUrl } = useAudioMagnament()
  const resetForm = () => setFormData(formDataDefault)


  const handleSend = async (content) => {
    setIsTyping(true);
    const systemMsg = {
      role: "system",
      content: `
      You are an expert in the dialogic method of instruction. 
      
      After the user choose the course of study, scaffold their comprehension through the following:
      
      a. limit your the type token ratio, mean length of utterance and subordination index to that of the ${storyText}
      b. limit your output to one sentence or phrase
      c. recast and expand on the user's utterances just above their zone of proximal development
      d. avoid asking more than one question at once
      e. avoid writing the entire story, word list or comprehension questions
      f. if the user chooses the story, walk them through the scenes one by one checking for comprehension and scaffolding the user's understanding.
      `
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

    const result = await callOpenAI([systemMsg, ...messages, newMessage], undefined, 0.6, 'gpt-3.5-turbo-16k');

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
    setAudioUrl(null)
    const data = { ...formData, story_length: `${getWordsCount(formData.story_length)} words` }

    const retrievedVoiceID = getVoiceID(data.target_language);
    setVoiceID(retrievedVoiceID);


    const messages = [
      {
        role: "system",
        content: `Objective:\nAccording to the parameters provided by the user, your task is to create an engaging narrative in the user's target language to aid language acquisition. Adhere to the user-specified parameters, including different levels of reading difficulty. Please ensure the story has a title formatted as \"TITLE: <history title>.\n\n\"\n\nUser Input Example:\n\njson\n{\n  \"story_topic\": \" Una historia de hobbits como la película\",\n  \"story_length\": \"500 words\",\n  \"reading_difficulty_level\": \"Beginner\",\n  \"story_genre\": \"Fiction\",\n  \"lesson_objectives\": \"Attention\",\n  \"target_language\": \"Spanish (US)\"\n}\n\nParameters:\n\n1. Story Topic: Una historia de hobbits como la película\n2. Story Length: 500 words\n3. Reading Difficulty Level: Beginner\n4. Story Genre: Fiction\n5. Lesson Objectives: Attention\n6. Target Language: Spanish (US)\n\nInstructions for Generating the Story:\n\nCreate an immersive narrative in target_language according to the specified parameters. Ensure that the story aligns with the \"story_length\" parameter provided by the user.\n\nBased on the user's request for a beginner-level story, use simple sentences, basic vocabulary, and a straightforward narrative structure.\n\nFollow the genre of fiction and focus on the lesson objective of capturing the reader's attention.\n\nInclude a title for the story formatted as \"TITLE: <history title>.\"\n\nTailor the language to the target language specified by the user, which is \"target_language\" in this case.\n\nBy following these instructions, you will create a language learning narrative that meets the user's specific requirements for difficulty level and content.\n\nReading Difficulty Levels:\n\n- Beginner: Low TTR, BICS Language, Heaps Narrative Structure, Simple Sentences, No Dialogue\n- Early Intermediate: Low-Moderate TTR, Transition from BICS to CALP Language, Protonarrative Structure, Simple and Some Compound Sentences, No Dialogue\n- Intermediate: High-Moderate TTR, CALP Language, Linear Narrative Structure, Mixture of Compound and Simple Sentences, Minimal One-Sided Dialogue\n- Advanced: High TTR, Advanced CALP Language, Chronological Narrative Structure, Complex Sentences with Embedded Clauses, Brief One-Sided Dialogue\n- Proficient: Very High TTR, Advanced CALP with Literary devices, Classic Narrative Structure, Complex Sentences with Multiple Embedded Clauses, Extensive Two-Sided Dialogue\n- Mastery: Extremely High TTR, Advanced CALP with Academic and Literary devices, Literary Narrative Structure, Highly Complex Sentences with Literary Devices, Rich and Nuanced Dialogue\n\nPossible Story Genres:\n- Drama: Focus on character-driven emotional or ethical conflicts. Climax often resolves the main issue.\n- Fable: Use animals as characters to deliver a straightforward moral lesson. Short, with a clear resolution.\n - Fairy Tale: Include magical elements, a quest, and archetypal characters like witches or princes. Usually ends happily.\n- Fantasy: Create a new world with its own rules, often involving a quest or magical elements. Complex characters and settings.\n- Fiction: Real-world setting, invented characters and events. Balanced plot structure with a climax and resolution.\n- Fiction in Verse: Same as fiction but told through poetry. Emotional depth is crucial.\n- Folklore: Traditional tales explaining natural phenomena or cultural traditions. Often passed down through generations.\n- Historical Fiction: Real historical setting, fictional characters or events. Research is key for authenticity.\n- Horror: Build suspense and fear through eerie settings and mysterious elements. Climax usually reveals the source of horror.\n- Humor: Light-hearted, revolves around comedic situations. Characters often find themselves in ridiculous scenarios.\n- Legend: Semi-true stories based on historical events but exaggerated. Focus on heroism or morals.\n-  Mystery: Plot centers on solving a puzzle or crime. Information revealed gradually, climax solves the mystery.\n- Mythology: Involves gods, heroes, and magic. Explains natural or social phenomena.\n- Poetry: Narrative elements optional. Focus on form and emotional or aesthetic expression.\n - Realistic Fiction: Plausible characters and settings, often contemporary. Emotional or social issues often drive the plot.\n - Science Fiction: Future or alternate settings with advanced technology. Often explores ethical implications.\n- Tall Tale: Exaggerated, unbelievable events or characters presented as true. Often humorous or outlandish.\n\n`},
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
              description: 'An Anticipation guide entitled "Anticipation Guide" followed by a glossary of key vocabulary with definitions to prepare the reader for the narrative entitled "Glossary". Each section is separate with its own title.'
            },
            post_reading: {
              type: 'string',
              description: 'Post-reading comprehension questions based on Blooms taxonomy to evaluate the reader comprehension entitled "Comprehension Questions"'
            }

          },
          required: ['story_text', 'pre_reading', 'post_reading']
        }
      }
    ]

    setIsLoading(true);
    close()

    const result = await callOpenAI(messages, functions, 1)

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
    const assistantMsg = { 
      role:'assistant', 
      content: `What do you need help with? buttons=[{"label": "Pre Reading", "value": "1"}, {"label": "Story Text", "value": "2"}, {"label": "Post Reading", "value": "3"}]`
    }
    setMessages([assistantMsg])
    setPreReadingActivity(functionArguments.pre_reading);
    console.log('PreReadingActivity:', preReadingActivity);
    setPostReadingActivity(functionArguments.post_reading);
    setStoryText(functionArguments.story_text);
    setIsLoading(false)
    resetForm()
    console.log('final')

  } 
 const size = useContext(ResponsiveContext)
  const documentIsReady = useMemo(() => {
    return !!(storyText !== "" && preReadingActivity !== "" && postReadingActivity !== "")
  }, [
    storyText,
    preReadingActivity,
    postReadingActivity
  ])

  const customTheme = {

    global: {
      colors: {
        brand: '#FCF6EB',
      }
    },

    formField: {
      border: {
        color: 'grey',
        side: 'all'
      },
      label: {
        weight: 'normal',
        size: '12px',
      }
    },

    button: {
      border: {
        radius: '8px',
      },
      primary: {
        color: '#FCF6EB',
      },
    },
  };


  const [showOnboarding, setShowOnboarding] = useState(true);

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <Grommet theme={customTheme}>
      <div>
        {/* <Header /> */}
        {
          user ? (
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
                  {showOnboarding && <OnboardingScreen onClose={closeOnboarding} />}
                  <ChatContainer>
                    <MessageList className='message-list' typingIndicator={isTyping ? <TypingIndicator content="" /> : null} >
                      {messages.map((message, i) => {
                        console.log('message.content', message.content)
                        const result = extractAndParseButtons(message.content)
                        console.log('result', result)
                        return <Message.CustomContent>  
                          <div className={message.role === 'user' ? 'outcoming' : 'incoming'}>
                            { result && result.replacedInput ? result.replacedInput : message.content}
                            {result && result.buttons && 
                              result.buttons.map(button => (
                                <button className='choice-button' onClick={() => handleSend(button.value)}>{button.label}</button>
                              ))
                            }
                          </div>
                        </Message.CustomContent>
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
             :
            <AuthComponent />
        }
        {/* <Footer story={story} /> */}
      </div>
    </Grommet >

  );
}

export default App;


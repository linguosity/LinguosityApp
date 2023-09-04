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
//import AzureTTSComponent from './AzureTTSComponent';

// function MyDocument({ text }) {
//   return (
//     <Document>
//       <Page>
//         <Text>{text}</Text>
//       </Page>
//     </Document>
//   );
// }
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
  const { show, open, close, toggle } = useShow(true)
  const modalRef = useRef()
  const { user } = useFirebaseAuth()
  const { setVoiceID } = useAudioMagnament()
  const resetForm = () => setFormData(formDataDefault)

  const handleSend = async (content) => {
    setIsTyping(true);
    const newMessage = {
      role: "user",
      content
    }
    setMessages(prev => [...prev, newMessage]);

    const result = await callOpenAI([newMessage]);

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
        content: `
Create an immersive narrative in the user's target language to aid language acquisition. Adhere to user-specified parameters including the following levels of reading difficulty:

Beginner
TTR: Low (Few unique words)
Language: BICS (Basic Interpersonal Communication Skills)
Narrative Structure: Heaps (Isolated, unrelated statements)
Sentence Complexity: Simple sentences
Dialogue: None
Example language:
"A cat sees a mouse. The cat runs. The mouse runs. The cat stops. The mouse hides."

Early Intermediate
TTR: Low-Moderate (More unique words than beginner)
Language: Transition from BICS to CALP (Introduction of academic vocabulary)
Narrative Structure: Protonarrative (Events are linear but not elaborated)
Sentence Complexity: Simple and some compound sentences
Dialogue: None
Example language:
"The cat saw a mouse in the yard. The cat started running after the mouse. Then, the mouse ran into a hole. The cat waited but then left."

Intermediate
TTR: High-Moderate (Expanded vocabulary)
Language: CALP (Academic Language)
Narrative Structure: Linear Narrative (Events are linear and somewhat detailed)
Sentence Complexity: Mixture of compound and simple sentences, some embedded clauses
Dialogue: Minimal, one-sided
Example language:
"The curious cat saw a mouse and thought, 'Aha, a game!' It ran swiftly. The mouse, sensing danger, sped towards a hole. The cat hesitated and then thought, 'Maybe not today.'"

Advanced
TTR: High (Rich vocabulary)
Language: Advanced CALP (Higher-level academic language)
Narrative Structure: Chronological Narrative (Linear storytelling with more details)
Sentence Complexity: Frequent use of embedded clauses and compound sentences
Dialogue: Brief, one-sided dialogue
Example language:
"In the sunlit yard, the cat noticed a mouse scurrying by the fence and thought, 'A perfect chance!' Eager to catch its prey, the cat sprinted. The mouse, sensing danger, dashed for a hole. 'Not today,' thought the mouse."

Proficient
TTR: Very High (Extensive vocabulary)
Language: Advanced CALP with literary elements
Narrative Structure: Classic Narrative (Characters, setting, problem, resolution)
Sentence Complexity: Complex sentences with multiple embedded clauses
Dialogue: Extensive, two-sided
Example language:
"In a tranquil yard, Whiskers the cat saw Timmy the mouse. 'Ah, the thrill of the chase,' thought Whiskers. 'I need to escape!' thought Timmy. Whiskers lunged, but Timmy darted into a hole. Both pondered what might have been."

Mastery 
TTR: Extremely High (Extremely varied and nuanced vocabulary)
Language: Advanced CALP with academic and literary elements
Narrative Structure: Literary Narrative (Characters, setting, problem, resolution, theme, symbolism)
Sentence Complexity: Highly complex sentences with multiple embedded clauses, literary devices, and varied sentence structures
Dialogue: Rich and nuanced, multiple characters
Example language:
"In a golden yard, Whiskers eyed Timmy. 'A perfect opportunity,' mused Whiskers. Timmy sensed danger, 'Not this time,' he thought. As Timmy vanished into a hole, Whiskers pondered, 'What's life without a little risk?' and sauntered off."

Provide all of the following written in ${data.target_language} -

1. PRE-READING ANTICIPATION GUIDE
Include 5 engaging numbered questions and true-false statements about theme, vocabulary, or structure separated by newline characters. Include a summary of the events of the story using emojis. '/n/'

2. PRE-READING GLOSSARY
Define academic words in an easily understandable, kid-friendly manner separated by newline characters '/n'

3. Emoji Retell
Effectively retell the story sequence in numbered steps using emojis with spacing for legibility. '/n'

4. POST-READING COMPREHENSION QUESTIONS based on BLOOM'S TAXONOMY
Create 12 questions of true false, fill in the blank, and open-ended formats, assessing understanding and engagement separated by newline characters.

Ensure all headings are in all caps. Create a clever story title as well. Return the story and its title as a JSON object with the story, anticipation guide, glossary and comprehension questions as properties of story_text, pre_reading and post_reading.
`
      },
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

    const result = await callOpenAI(messages, functions)

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
      {
        user ? (
          <div className="app-container">
            <Sidenav
              story={story}
              handleOpenForm={toggle}
              pdfDocument={
                documentIsReady ?
                  <MyDocument pages={[
                    storyText,
                    preReadingActivity,
                    postReadingActivity
                  ]} /> : undefined
              }
            />
            <div className="right-column" ref={modalRef}>
              <MainContainer >
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
                <Modal target={modalRef.current} isOpen={open} onClose={close} position='left'>
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
          </div>) :
          <AuthComponent />
      }
      {/* <Footer story={story} /> */}
    </div>

  );
}

export default App;


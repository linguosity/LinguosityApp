import React, { useState, useRef, useEffect } from 'react';
import { Configuration, OpenAIApi } from "openai";
import linguosityLogo from './assets/linguosity_logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import "isomorphic-fetch";
import "es6-promise";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ReplayIcon from '/ReplayIcon';
import Tabs from './Tabs';
import { runModel, createPredictionWithWebhook } from './ReplicateAPI';
import { TextToVoice } from './texttoVoice'; // Adjust the path as needed
import { voicesData } from './voicesData'; // Adjust the path as needed
import { BiLogOut } from 'react-icons/bi'

//import AzureTTSComponent from './AzureTTSComponent';

import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, InputToolbox } from "@chatscope/chat-ui-kit-react"
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

// Import required icons
import { useFirebaseAuth } from './FirebaseContext';
import AuthComponent from './AuthComponent';
import { AiOutlineMessage, AiOutlineBook, AiOutlineFilePdf, AiOutlineForm } from 'react-icons/ai';
import ParamsForm from './ParamsForm';
import Modal from './Modal';
import useShow from './hooks/useShow';
import getWordsCount from './utils/getWordsCount';
import { Box, Grommet, TextInput } from 'grommet';

const API_KEY = import.meta.env.VITE_APP_OPENAI_API_KEY;


// Header component
function Header() {
  return (
    <header>
      <aside className="hero-copy">
        <div data-collapse="medium" data-animation="default" data-duration="400" role="banner" className="nav w-nav">
          <div className="nav-inner">

            <div className="nav-menu-wrap w-clearfix">
              <aside role="navigation" className="nav-menu-2 w-nav-menu">
                <a href="story-generator.html" id="beta" className="nav-link w-nav-link">Beta</a>
                <a href="#features" className="nav-link w-nav-link">Features</a>
                <a href="creative-cache.html" id="creative-cache" className="nav-link w-nav-link">Creative Cache</a>
                <a id="signInButton" href="#how-to-use" className="nav-link w-nav-link">Sign-in</a>
                <a id="signOutButton" href="#how-to-use" className="nav-link w-nav-link">Sign-out</a>
                <a id="signOutButton" href="#how-to-use" className="nav-link w-nav-link">
                  <strong id="userName">userName</strong>
                </a>
                <a id="signOutButton" href="#how-to-use" className="nav-link w-nav-link" />
                <img src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" width="52" id="userProfilePic" alt="" className="image-7" />
              </aside>
              <div className="menu-button w-nav-button">
                <div className="menu-icon w-icon-nav-menu" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </header>
  );


}

//left column side nav component
function Sidenav({ story, audioUrl, handleOpenForm }) {
 const { logout } = useFirebaseAuth()
  function MyDocument({ text }) {
    return (
      <Document>
        <Page>
          <Text>{text}</Text>
        </Page>
      </Document>
    );
  }

  return (
    <div className="sidenav-wrapper">
      <div className="nav-logo-wrap">
        <a href="#" className="brand w-nav-brand">
          <img width="25" src="https://uploads-ssl.webflow.com/643f1edf85eba707f45ddfc3/646255f5e004cd49868bd0df_linguosity_logo.svg" alt="Linguosity logo" className="logo-image" />
          <div className="brand_name">Linguosity</div>
        </a>

      </div>

      <div className="footer-content">
        <div className="toolbar">

          <PDFDownloadLink document={<MyDocument text={story} />} fileName="story.pdf">
            {({ blob, url, loading, error }) =>
              loading ? 'Loading document...' : <AiOutlineFilePdf />
            }
          </PDFDownloadLink>
          <div id="audio-playback">
            {/* Replay button */}
            <button onClick={() => {
              if (audioUrl) {
                const audio = new Audio(audioUrl);
                audio.play();
              }
            }}>
              <ReplayIcon />
            </button>

            {/* Download link */}
            {audioUrl && (
              <a href={audioUrl} download="story.mp3">
                Download Audio
              </a>
            )}
          </div>
          <BiLogOut onClick={logout} />
          <AiOutlineForm onClick={handleOpenForm} />
        </div>
      </div>
    </div>
  );

}

// Footer component

function Footer({ story, audioUrl }) {
  function MyDocument({ text }) {
    return (
      <Document>
        <Page>
          <Text>{text}</Text>
        </Page>
      </Document>
    );
  }

  return (
    <div>
      <footer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px' }}>
        <div className="footer-content">
          <div className="toolbar">

            <PDFDownloadLink document={<MyDocument text={story} />} fileName="story.pdf">
              {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : <AiOutlineFilePdf />
              }
            </PDFDownloadLink>
            <div id="audio-playback">
              {/* Replay button */}
              <button onClick={() => {
                if (audioUrl) {
                  const audio = new Audio(audioUrl);
                  audio.play();
                }
              }}>
                Replay
              </button>

              {/* Download link */}
              {audioUrl && (
                <a href={audioUrl} download="story.mp3">
                  Download Audio
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_APP_OPENAI_API_KEY
});




const customTheme = {
  global: {
    colors: {
      brand: '#FCF6EB',
    },
  },
}


function App() {

  const [messages, setMessages] = useState([])

  const messagesEndRef = useRef(null);

  const [userInput, setUserInput] = useState("");
  const [imageURL, setImageURL] = useState("");
  const openai = new OpenAIApi(configuration);
  const [voiceID, setVoiceID] = useState(null);
  const [story, setStory] = useState("");

  // HERE IS THE NEW CODE
  const [storyText, setStoryText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [preReadingActivity, setPreReadingActivity] = useState('');
  const [postReadingActivity, setPostReadingActivity] = useState('');
  const [audioUrl, setAudioUrl] = useState("");

  const [activeTab, setActiveTab] = useState('story');
  const [isTyping, setIsTyping] = useState(false);

  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function getVoiceIDForLanguage(targetLanguage) {
    console.log("Target Language:", targetLanguage); // Log the input
    for (let voice of voicesData[0].voices) {
      console.log("Checking Voice Language:", voice.language); // Log each voice language
      if (voice.language === targetLanguage) {
        console.log("Match Found:", voice.value);
        return voice.value;
      }
    }
    console.log("No Match Found"); // Log if no match is found
    return null;
  }

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    };
  }, [audio]);

  //generate Image from OpenAI's DALLE API
  async function generateImage(prompt) {
    try {
      const additionalText = ` in the style of a graphic novel`;
      const modifiedPrompt = `${prompt} ${additionalText}`;

      const res = await openai.createImage({
        prompt: modifiedPrompt,
        n: 1,
        size: "256x256",
      });

      setImageURL(res.data.data[0].url);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  const playAudio = (text, voiceID) => {
    const voice = voiceID; // Hardcoding the voice to 'larry'
    const apiUrl = `/.netlify/functions/playaudio`;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data (e.g., play the audio)

        console.log('Received data:', data);
        const audioUrl = data.url; // Assuming the response includes the audio URL
        console.log('Audio URL:', audioUrl);
        const audio = new Audio(audioUrl);
        audio.play();
      })
      .catch((error) => {
        console.error('An error occurred:', error);
        // Handle any errors
      });
  };







  // 
  const handleSend = async (message) => {
    setIsTyping(true);
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage];
    //update our messages state
    setMessages(newMessages);

    //process message to ChatGPT (send it over and see response)
    await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(data) {

    const retrievedVoiceID = getVoiceIDForLanguage(data.target_language);
    setVoiceID(retrievedVoiceID);

    const apiRequestBody = {
      // Modify the following code to suit your needs
      model: "gpt-4-0613",
      messages: [
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
      ],

      temperature: 0.9,
      //max_tokens: 8000,

      functions: [
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
      ],

      //function_call: 'write_story_activities'
    }

    try {
      setIsLoading(true);
      const result = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      })

      const json = await result.json()
      const rawArguments = json.choices[0].message.function_call.arguments;
      const sanitizedArguments = rawArguments.replace(/[\u0000-\u0019]+/g, "");
      const functionArguments = JSON.parse(sanitizedArguments);
      console.log(functionArguments.story_text);
      console.log(functionArguments.pre_reading);
      console.log(functionArguments.post_reading);

      setPreReadingActivity(functionArguments.pre_reading);
      setPostReadingActivity(functionArguments.post_reading);
      setStoryText(functionArguments.story_text);

      /*let storyContainer = document.getElementById("actual-story-container");
   
        if(storyContainer) {
          storyContainer.innerText = story_text;
          console.log("hello");
        }*/


    } catch (error) {
      console.log('error on API call', error)
    } finally {
      setIsLoading(false)
    }


    // Function to process the function call arguments and generate a response
    function processFunctionCall(functionArguments) {
      // Process the arguments and generate a response based on your requirements
      // For example, you can call an external API or perform some calculations
      // In this example, we'll just return a string representation of the arguments

      return `Function call processed with arguments: ${JSON.stringify(
        arguments,
        null,
        2
      )}`;


    }
  }

  const { user } = useFirebaseAuth()
  const formDataDefault = {
    story_topic: '',
    story_length: '',
    reading_difficulty_level: '',
    story_genre: '',
    lesson_objectives: '',
    target_language: '',
  };

  const { show, open, close, toggle } = useShow(true)
  const [formData, setFormData] = useState(formDataDefault);

  const resetForm = () => setFormData(formDataDefault)

  const generateStory = (e) => {
    e.preventDefault()
    const data = { ...formData, story_length: `${getWordsCount(formData.story_length)} words` }
    processMessageToChatGPT(data)
    close()
    resetForm()
  }

  const modalRef = useRef()

  return (
    <Grommet theme={customTheme} fill>
      <Header />
        {
          user ? (
            <div className="app-container">
              <Sidenav story={story} handleOpenForm={toggle} />
              <div className="right-column" ref={modalRef}>
                <MainContainer >
                  <ChatContainer>
                    <MessageList typingIndicator={isTyping && <TypingIndicator content="" />} >
                      {messages.map((message, i) => {
                        return <Message key={i} model={message} />
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
                      onSubmit={generateStory}
                    />
                  </Modal>
                )}
              </div>
              {isLoading &&
                <div className="logo-container">
                  <img src={linguosityLogo} className="image-6" alt="Loading..." />
                </div>
              }
              <div className={`tab-wrapper ${isLoading ? 'loading' : ''}`}>
                <div className="tab-shadow">
                  <Tabs
                    story_text={storyText}
                    pre_reading={preReadingActivity}
                    post_reading={postReadingActivity}
                    voice={voiceID}
                    playAudio={playAudio}
                  />
                </div>
              </div>
             </div> ) :
            <AuthComponent />
          }
      <Footer story={story} />
    </Grommet>
  );
}

export default App;


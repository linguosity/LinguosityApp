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


//import AzureTTSComponent from './AzureTTSComponent';

import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, InputToolbox } from "@chatscope/chat-ui-kit-react"
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

// Import required icons
import { AiOutlineMessage, AiOutlineBook, AiOutlineFilePdf, AiOutlineForm } from 'react-icons/ai';
import ParamsForm from './ParamsForm';
import ModalComponent from './ModalComponent';
import useShow from './hooks/useShow';

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

  async function processMessageToChatGPT() {
    
    const retrievedVoiceID = getVoiceIDForLanguage(formData.target_language);
    setVoiceID(retrievedVoiceID);

    const apiRequestBody = {
      // Modify the following code to suit your needs
      model: "gpt-4-0613",
      messages: [
        {
          role: "system",
          content: `
              Create an immersive narrative in the user's target language to aid language acquisition. Adhere to specified parameters, including word count.

Shape your narrative using elements like narrative voice (shifting between first and third person), linear or non-linear structure, and varied tense. Use dialogue to enrich characters and propel the plot, or focus on description and action. Vary the level of detail in setting descriptions and develop characters with static or evolving traits.

Explore internal or external conflicts and express themes overtly or subtly. Consider genre-specific norms to enhance credibility.

For different learning levels:

Early beginners: Simple sentences, basic vocabulary, and introductions.
Beginners: More structure, though lacking a clear beginning, middle, and end.
Early intermediate: Further character development, expanded vocabulary, and multiple settings and conflicts.
Advanced: Varied sentence structures, complex characters, and non-linear narratives resembling "Complex narratives."
Proficient: Showcase mastery with sophisticated language, multi-dimensional characters, and profound themes or plot twists.
Expand the narrative's length meaningfully to ensure that the character's problem or problems are solved by specific well-detailed steps of action.

Provide all of the following written in ${formData.target_language} -

1. PRE-READING ANTICIPATION GUIDE
Include 5 engaging numbered questions and true-false statements about theme, vocabulary, or structure separated by newline characters. Include a summary of the events of the story using emojis. '/n/'

2. PRE-READING GLOSSARY
Define academic words in an easily understandable, kid-friendly manner separated by newline characters '/n'

3. Emoji Retell
Effectively retell the story sequence in steps using emojis. '/n'

4. POST-READING COMPREHENSION QUESTIONS based on BLOOMS TAXONOMY
Create 12 questions of true false, fill in the blank, and open-ended formats, assessing understanding and engagement separated by newline characters.

Ensure all headings are in all caps. Create a clever story title as well. Return the story and its title as a JSON object with the story, anticipation guide, glossary and comprehension questions as properties of story_text, pre_reading and post_reading. 
              `
        },
        {
          role: "user",
          content: "Write me a story, pre-reading guide and post-reading questions based on the following parameters paying careful attention to each:" + JSON.stringify(formData)
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


  const { show, open, close, toggle } = useShow(true)
  const [formData, setFormData] = useState({
    story_topic: '',
    story_length: '',
    reading_difficulty_level: '',
    story_genre: '',
    educational_objectives: '',
    target_language: '',
  });

  const generateStory = (e) => {
    e.preventDefault()
    processMessageToChatGPT()
    close()
  }

  return (
    <div>
      <Header />
      <div className="app-container">
        <Sidenav story={story} handleOpenForm={toggle} />
        <div className="right-column">
          <MainContainer>

            {show && (
            <ModalComponent isOpen={open} onClose={close}>
              <ParamsForm formData={formData} setFormData={setFormData} handleSubmit={generateStory} />
            </ModalComponent>
            )}
            <ChatContainer>
              <MessageList typingIndicator={isTyping && <TypingIndicator content="" />} >
                {messages.map((message, i) => {
                  return <Message key={i} model={message} />
                })}
              </MessageList>
              <MessageInput placeholder='Type message here' onSend={handleSend} />

            </ChatContainer>
          </MainContainer>
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

      </div>
      <Footer story={story} />
    </div >
  );
}

export default App;


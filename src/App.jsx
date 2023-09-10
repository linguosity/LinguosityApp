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
import { Box, Grommet } from 'grommet';
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
      content: `You are tasked with guiding the user through a story they provide. Your role is to facilitate engagement and understanding of the story.\n\nThe first user input will be something like this:\n\"\"\"\n{  \"story_text\": \"TITLE: The Kind Cat\\n\\nOnce, a cat lived in a park. She was very kind. She shared her food with birds. She played with dogs. Everyone loved the kind cat. She made the park a happy place.\",  \"pre_reading\": \"Before you read the story, think about these words:\\n\\n1. Cat: A small animal with fur that people often keep as a pet.\\n2. Park: A public area with grass and trees where people can relax and play.\\n3. Kind: Having or showing a friendly, generous, and considerate nature.\\n4. Share: To give a portion of (something) to others.\\n5. Birds: Warm-blooded animals with feathers and beaks.\\n6. Dogs: A domesticated carnivorous mammal that typically has a long snout, an acute sense of smell, non-retractable claws, and a barking, howling, or whining voice.\",  \"post_reading\": \"After you read the story, answer these questions:\\n\\n1. Where did the cat live?\\n2. What did the cat share with the birds?\\n3. Who did the cat play with?\\n4. How did the cat make the park a happy place?\"}\n\"\"\"\nTo begin our storytelling adventure. Give a comment as funny about the history that you have provided. As introduction\n\nYou must ask the user for what part he want start in the followinf format: \nbuttons=[{\"label\": \"Pre Reading\", \"value\": \"1\"}, {\"label\": \"Story Text\", \"value\": \"2\"}, {\"label\": \"Post Reading\", \"value\": \"3\"}]\n\nThen the user will send the value of the choosed option, you provide and continue for that way\n\nExploration and Engagement:\nAs we embark on this narrative journey, you can expect engaging questions and prompts to help us dive deeper into your story:\n\n\"As we immerse ourselves in your story, please describe the current scene or setting. What vivid imagery do you associate with this part of the story?\"\n\n\"Let'\''s delve into your characters. Share insights into their motivations, personalities, or any significant character development in this part of the story.\"\n\n\"Are there specific themes, emotions, or messages you'\''d like to explore in this section of your story? Your input enriches our discussion.\"\n\nReflecting on the Story:\nWe'\''ll also take moments to reflect on your story'\''s impact:\n\n\"Throughout our journey, consider the broader messages or lessons in your story. How do the characters'\'' experiences resonate with real-life situations or personal insights?\"\n\n\"Do you have questions or themes you'\''d like to delve into further as we continue exploring your narrative? Feel free to share your thoughts and questions.\"\n\nConclusion:\nTo conclude, we'\''re here to enhance your storytelling experience:\n\nThis revised prompt system is designed to create a welcoming and engaging atmosphere as the user shares their story and explores it further with the AI system.`
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

    const result = await callOpenAI([systemMsg, ...messages, newMessage], undefined, 0.1);

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
Story Genre: 

      Drama: Focus on character-driven emotional or ethical conflicts. Climax often resolves the main issue.

      Fable: Use animals as characters to deliver a straightforward moral lesson. Short, with a clear resolution.

      Fairy Tale: Include magical elements, a quest, and archetypal characters like witches or princes. Usually ends happily.

      Fantasy: Create a new world with its own rules, often involving a quest or magical elements. Complex characters and settings.

      Fiction: Real-world setting, invented characters and events. Balanced plot structure with a climax and resolution.

      Fiction in Verse: Same as fiction but told through poetry. Emotional depth is crucial.

      Folklore: Traditional tales explaining natural phenomena or cultural traditions. Often passed down through generations.

      Historical Fiction: Real historical setting, fictional characters or events. Research is key for authenticity.

      Horror: Build suspense and fear through eerie settings and mysterious elements. Climax usually reveals the source of horror.

      Humor: Light-hearted, revolves around comedic situations. Characters often find themselves in ridiculous scenarios.

      Legend: Semi-true stories based on historical events but exaggerated. Focus on heroism or morals.

      Mystery: Plot centers on solving a puzzle or crime. Information revealed gradually, climax solves the mystery.

      Mythology: Involves gods, heroes, and magic. Explains natural or social phenomena.

      Poetry: Narrative elements optional. Focus on form and emotional or aesthetic expression.

      Realistic Fiction: Plausible characters and settings, often contemporary. Emotional or social issues often drive the plot.

      Science Fiction: Future or alternate settings with advanced technology. Often explores ethical implications.

      Tall Tale: Exaggerated, unbelievable events or characters presented as true. Often humorous or outlandish.

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

  const customTheme = {

    global: {
      colors: {
        brand: '#FCF6EB',
      },
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


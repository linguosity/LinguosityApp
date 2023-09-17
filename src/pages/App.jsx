import { useState, useRef, useMemo, useEffect } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react"
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Grommet } from 'grommet';
import { useAudioMagnament } from '../context/AudioMagnament';
import ParamsForm from '../components/ParamsForm';
import Tabs from '../components/Tabs';
import Modal from '../components/Modal';
import Sidenav from '../components/Sidenav';
import MyDocument from '../components/MyDocument';
import OnboardingScreen from '../components/OnBoarding';
import useShow from '../hooks/useShow';
import getWordsCount from '../utils/getWordsCount';
import getVoiceID from '../utils/getVoiceID';
import extractAndParseButtons from '../utils/extractAndParseButtons';
import callOpenAI from '../lib/callOpenAI';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import validateCheckoutSession from '../lib/validateCheckoutSession';
import retrieveSubscription from '../lib/retrieveSubsctiption';
import retrieveCredential from '../utils/retrieveCredential';

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
  const [isTyping, setIsTyping] = useState(false);
  const [formData, setFormData] = useState(formDataDefault);
  const { show, open, close, toggle } = useShow()
  const modalRef = useRef()
  const { setVoiceID, setAudioUrl } = useAudioMagnament()
  const resetForm = () => setFormData(formDataDefault)
  const [historyData, setHistoryData] = useState({ story_text: '', pre_reading: '', post_reading: '' })
  const [activeTab, setActiveTab] = useState('story_text');
  const navigate = useNavigate()
  const { setUser, updateDBEntry, user, userData, getDBEntry } = useFirebase()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {

    const credential = retrieveCredential()
    if (!credential) {
      navigate('/login')
    } else {
      setUser({ id: credential.uid, name: credential.displayName ?? credential.email, avatar: credential.photoUrl ?? undefined });

      getDBEntry(credential.uid).then(entry => {
      
        const currentMonth = (new Date().getUTCMonth())
        const lastLoginMonth = (new Date(entry.lastLogin)).getUTCMonth()
        if (currentMonth !== lastLoginMonth) {
          updateDBEntry(credential.uid, { lastLogin: (new Date()).toUTCString(), generations: 0 })
        } else {
          updateDBEntry(credential.uid, { lastLogin: (new Date()).toUTCString() })
        }

      })



      if (searchParams.get("from") === "stripe") {
        validateCheckoutSession(searchParams.get("session_id"))
        .then(async result => {
          if (result.isValid) {
            const subscription = await retrieveSubscription(result.subscriptionId)
            updateDBEntry(credential.uid, {
              plan: searchParams.get("plan"),
              customerId: result.customerId,
              subscriptionId: result.subscriptionId,
              subscriptionStatus: subscription.status
            })
          }
        })
          .finally(() => setSearchParams(new URLSearchParams([])))
      } else {
        getDBEntry(credential.uid)
        .then(async entry => {
          if (entry.plan !== "free") {
            const subscription = await retrieveSubscription(entry.subscriptionId)
            if (subscription) {
              updateDBEntry(credential.uid, { subscriptionStatus: subscription.status })
            }

          }
        })
      }
    }
  }, [])



  const addChunk = (chunk) => {
    setMessages(prev => {
      const newMsgs = [...prev]
      const lastMsg = newMsgs[newMsgs.length - 1]
      lastMsg.content += chunk
      return newMsgs
    })
  }

  const handleSend = async (content) => {
    setIsTyping(true);

    const systemMsg = {
      role: "system",
      content: `
      
      You are configured to initiate dialogic teaching methods immediately from your very first output. Strictly adhere to these guidelines:

1. If the user chooses pre-reading feed the user just one item from the glossary or anticipation guide.
2. If the user chooses story text, feed the user one scene or event at a time from the story.
3. If the user chooses post-reading, feed the user one question at a time from the comprehension questions.


      `
    }
    const newMessage = {
      role: "user",
      content
    }
    const newMsgs = [
      {
        role: "system",
        content: `
          Ask the user which part of the lesson (${JSON.stringify(historyData, null, 2)}) they want help with: Pre Reading, Story Text or Post Reading. In the last list of this message you must use the following text, it will be used for rendering buttons:\nbuttons=[{"label": "Pre Reading", "value": "1"}, {"label": "Story Text", "value": "2"}, {"label": "Post Reading", "value": "3"}]\n\n 
          Follow these formats depending on the user's choice for dialogic instruction:
          
          a. Prereading
          Bot: Let's warm up. [Pose the first anticipation guide item]. 

          OR

          Bot: Let's review vocabulary. The word for today is [Insert vocabulary word from the glossary]. Can you make a sentence with this word?

          OR 

          Bot: Tell me what you already know about [vocabulary word or anticipation guide idea].

          OR

          Bot: The theme of this story is [theme]. Have you ever experienced something similar in your life?

          b. Reading
          Bot: Let's begin the Story Text. "In the first scene, [Insert event or key detail from the first scene of the story]". What do you think this tells us about the main character(s)?

          OR

          Bot: What do the character(s) see, hear, touch, feel or smell in this scene?

          OR

          Bot: Let's stop here. [Pose one inference question to the user].

          c. Recap
          Bot: Time for Post Reading. Let's see how well you understood the story. [Insert comprehension question #1]. 
        
          OR

          Bot: Time for Post Reading. Retell the story back to me in your own words.

          When you and the user finish with a topic, move on to the next #item in the lesson.

          Strictly adhere to these guidelines:

            1. If the user chooses pre-reading feed the user just one item from the glossary or anticipation guide.
            2. If the user chooses story text, feed the user one scene or event at a time from the story.
            3. If the user chooses post-reading, feed the user one question at a time from the comprehension questions.
            4. If a user makes a spelling or grammar mistake, recast their word, phrase or sentence with the correction in bold html tags
            5. If a user makes no mistake, slightly expand on the user's utterance within their zone of proximal development (e.g. Mean length of utterance, vocabulary diversity)
          `
      },
      ...messages,
      newMessage
    ]
    setMessages(prev => [...prev, newMessage]);


    const stream = await callOpenAI(
      newMsgs,
      undefined,
      0.6,
      'gpt-3.5-turbo-16k',
      true,

    );
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    for await (const part of stream) {
      if (part.choices[0]?.delta?.content) {
        addChunk(part.choices[0]?.delta?.content)
      }
    }
    setIsTyping(false);

  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    setAudioUrl(null)
    const data = { ...formData, story_length: `${getWordsCount(formData.story_length)} words` }

    const retrievedVoiceID = getVoiceID(data.target_language);
    setVoiceID(retrievedVoiceID);


    const newMsgs = [
      {
        role: "system",
        content: `Objective:\nAccording to the parameters provided by the user, your task is to create an engaging narrative in the user's target language to aid language acquisition. Adhere to the user-specified parameters, including different levels of reading difficulty. Please ensure the story has a title formatted as \"TITLE: <history title>.\n\n\"\n\nUser Input Example:\n\njson\n{\n  \"story_topic\": \" Una historia de hobbits como la película\",\n  \"story_length\": \"500 words\",\n  \"reading_difficulty_level\": \"Beginner\",\n  \"story_genre\": \"Fiction\",\n  \"lesson_objectives\": \"Attention\",\n  \"target_language\": \"Spanish (US)\"\n}\n\nParameters:\n\n1. Story Topic: Una historia de hobbits como la película\n2. Story Length: 500 words\n3. Reading Difficulty Level: Beginner\n4. Story Genre: Fiction\n5. Lesson Objectives: Attention\n6. Target Language: Spanish (US)\n\nInstructions for Generating the Story:\n\nCreate an immersive narrative in target_language according to the specified parameters. Ensure that the story aligns with the \"story_length\" parameter provided by the user.\n\nBased on the user's request for a beginner-level story, use simple sentences, basic vocabulary, and a straightforward narrative structure.\n\nFollow the genre of fiction and focus on the lesson objective of capturing the reader's attention.\n\nInclude a title for the story formatted as \"TITLE: <history title>.\"\n\nTailor the language to the target language specified by the user, which is \"target_language\" in this case.\n\nBy following these instructions, you will create a language learning narrative that meets the user's specific requirements for difficulty level and content.\n\nReading Difficulty Levels:\n\n- Beginner: Low TTR, BICS Language, Heaps Narrative Structure, Simple Sentences, No Dialogue\n- Early Intermediate: Low-Moderate TTR, Transition from BICS to CALP Language, Protonarrative Structure, Simple and Some Compound Sentences, No Dialogue\n- Intermediate: High-Moderate TTR, CALP Language, Linear Narrative Structure, Mixture of Compound and Simple Sentences, Minimal One-Sided Dialogue\n- Advanced: High TTR, Advanced CALP Language, Chronological Narrative Structure, Complex Sentences with Embedded Clauses, Brief One-Sided Dialogue\n- Proficient: Very High TTR, Advanced CALP with Literary devices, Classic Narrative Structure, Complex Sentences with Multiple Embedded Clauses, Extensive Two-Sided Dialogue\n- Mastery: Extremely High TTR, Advanced CALP with Academic and Literary devices, Literary Narrative Structure, Highly Complex Sentences with Literary Devices, Rich and Nuanced Dialogue\n\nPossible Story Genres:\n- Drama: Focus on character-driven emotional or ethical conflicts. Climax often resolves the main issue.\n- Fable: Use animals as characters to deliver a straightforward moral lesson. Short, with a clear resolution.\n - Fairy Tale: Include magical elements, a quest, and archetypal characters like witches or princes. Usually ends happily.\n- Fantasy: Create a new world with its own rules, often involving a quest or magical elements. Complex characters and settings.\n- Fiction: Real-world setting, invented characters and events. Balanced plot structure with a climax and resolution.\n- Fiction in Verse: Same as fiction but told through poetry. Emotional depth is crucial.\n- Folklore: Traditional tales explaining natural phenomena or cultural traditions. Often passed down through generations.\n- Historical Fiction: Real historical setting, fictional characters or events. Research is key for authenticity.\n- Horror: Build suspense and fear through eerie settings and mysterious elements. Climax usually reveals the source of horror.\n- Humor: Light-hearted, revolves around comedic situations. Characters often find themselves in ridiculous scenarios.\n- Legend: Semi-true stories based on historical events but exaggerated. Focus on heroism or morals.\n-  Mystery: Plot centers on solving a puzzle or crime. Information revealed gradually, climax solves the mystery.\n- Mythology: Involves gods, heroes, and magic. Explains natural or social phenomena.\n- Poetry: Narrative elements optional. Focus on form and emotional or aesthetic expression.\n - Realistic Fiction: Plausible characters and settings, often contemporary. Emotional or social issues often drive the plot.\n - Science Fiction: Future or alternate settings with advanced technology. Often explores ethical implications.\n- Tall Tale: Exaggerated, unbelievable events or characters presented as true. Often humorous or outlandish.\n\n`
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

    // setIsLoading(true);
    close()
    resetForm()

    const stream = await callOpenAI(
      newMsgs,
      functions,
      1,
      undefined,
      true,
      "auto"
    );

    let buffer = "";
    const regexByKey = /"([^"]+)":\s/;
    const regexComa = /",/;
    let currentKey = "";

    for await (const chunk of stream) {
      const text = chunk['choices'][0]?.delta?.function_call?.arguments;
      if (!text) continue
      buffer += text;
      const matchByKey = buffer.match(regexByKey);
      const matchByComa = buffer.match(regexComa);

      if (matchByKey) {
        currentKey = matchByKey[1];
        buffer = "";
        setActiveTab(currentKey)
        continue
      } else if (matchByComa) {
        currentKey = ""
      }

      if (currentKey) {

        let newValue = buffer.replace(/\\n/g, '\n').replace(/\"/, "").replace("}", "")
        setHistoryData(prev => ({
          ...prev,
          [currentKey]: newValue
        }));
      }
    }
    const assistantMsg = {
      role: 'assistant',
      content: `Great! Let's dive right in. Please choose which part of the story you'd like to start with: buttons=[{"label": "Pre Reading", "value": "1"}, {"label": "Story Text", "value": "2"}, {"label": "Post Reading", "value": "3"}]`
    }
    setMessages([assistantMsg])

    updateDBEntry(user.id, { generations: userData.generations + 1 })


  }

  const documentIsReady = useMemo(() => {
    return !!(historyData.story_text !== "" && historyData.pre_reading !== "" && historyData.post_reading !== "")
  }, [
    historyData.story_text,
    historyData.pre_reading,
    historyData.post_reading
  ])

  const [showOnboarding, setShowOnboarding] = useState(true);

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="app-container">
      <Sidenav
        openForm={open}
        pdfDocument={
          documentIsReady ?
            <MyDocument pages={[
              historyData.story_text,
              historyData.pre_reading,
              historyData.post_reading
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
                    {result && result.replacedInput ? result.replacedInput : message.content}
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
      <div className="tab-wrapper">
        <div className="tab-shadow">
          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            story_text={historyData.story_text}
            pre_reading={historyData.pre_reading}
            post_reading={historyData.post_reading}
          />
        </div>
      </div>
      {/* {isLoading && <Logo />} */}
    </div>
  );
}

export default App;


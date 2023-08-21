import React from 'react';

const apiKey = import.meta.env.VITE_APP_PLAYHT_API_KEY;

const Story = ({ story }) => {
  const lines = story.split('\n');
  const title = lines[0].trim();
  const paragraphs = lines.slice(1).filter((line) => line.trim() !== '');

  return (
    <div id="story-window">
      {title && <h1>{title}</h1>}
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
};


const PreReading = ({ preReading }) => {
  // Splitting by lines
  const lines = preReading.split('\n');

  // Splitting anticipation guide and glossary
  const anticipationGuideIndex = lines.findIndex(line => line.trim().toLowerCase().startsWith('pre-reading anticipation guide'));
  const glossaryIndex = lines.findIndex(line => line.trim().toLowerCase().startsWith('pre-reading glossary'));

  const anticipationGuideLines = lines.slice(anticipationGuideIndex + 1, glossaryIndex);
  const glossaryLines = lines.slice(glossaryIndex + 1);

  const anticipationGuideQuestions = anticipationGuideLines.join(' ').split(/\d+\./).slice(1).map((item, index) => `${index + 1}.${item.trim()}`);
  const glossaryItems = glossaryLines.join(' ').split(/\d+\./).slice(1).map((item, index) => `${index + 1}.${item.trim()}`);

  return (
    <div id="pre-reading-window">
      {anticipationGuideQuestions.length > 0 && (
        <div>
          <h2>PRE-READING ANTICIPATION GUIDE</h2>
          <ul>
            {anticipationGuideQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      )}
      {glossaryItems.length > 0 && (
        <div>
          <h2>PRE-READING GLOSSARY</h2>
          <ul>
            {glossaryItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};



const PostReading = ({ postReading }) => {
  const lines = postReading.split('\n');
  const heading = lines[0].trim();

  // Join the rest of the lines and split by numbers followed by a dot.
  const items = lines.slice(1).join(' ').split(/\d+\./).slice(1).map((item, index) => `${index + 1}.${item.trim()}`);

  return (
    <div id="post-reading-window">
      {heading && <h2>{heading}</h2>}
      {items.length > 0 && (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};


export function TextToVoice({ activeTab, story_text, pre_reading, post_reading, voice, playAudio }) {
  const convertToSpeech = (text) => {
    playAudio(text, voice);
  };

  return (
    <div className="tab">
      {activeTab === 'one' && (
        <div>
        
          <PreReading preReading={pre_reading} />
        </div>
      )}
      {activeTab === 'two' && (
        <div>
          <button className="play-button" onClick={() => convertToSpeech(story_text)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="seek">
              <g data-name="4">
                <path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,27A13,13,0,1,1,29,16,13,13,0,0,1,16,29Z"></path>
                <polygon points="17 15.38 10 11 10 21 17 16.63 17 21 19 21 19 11 17 11 17 15.38"></polygon>
                <rect width="2" height="10" x="21" y="11"></rect>
              </g>
            </svg>
          </button>
          <Story story={story_text} />
        </div>
      )}
      {activeTab === 'three' && (
        <div>
          
          <PostReading postReading={post_reading} />
        </div>
      )}
    </div>
  );
}

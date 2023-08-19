import React from 'react';

const apiKey = import.meta.env.VITE_APP_PLAYHT_API_KEY;

export function TextToVoice({ activeTab, story_text, pre_reading, post_reading, voice, playAudio }) {
  const convertToSpeech = (text) => {
    playAudio(text, voice);
  };
    
  const renderContent = (text) => (
    <div className="paragraph-container">
      <button className="play-button" onClick={() => convertToSpeech(text)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="seek">
                <g data-name="4">
                  <path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,27A13,13,0,1,1,29,16,13,13,0,0,1,16,29Z"></path>
                    <polygon points="17 15.38 10 11 10 21 17 16.63 17 21 19 21 19 11 17 11 17 15.38"></polygon>
                    <rect width="2" height="10" x="21" y="11"></rect>
                    </g>
              </svg>
      </button>
      <p>{text}</p>
    </div>
  );

  return (
    <div className="tab">
      {activeTab === 'one' && renderContent(pre_reading)}
      {activeTab === 'two' && renderContent(story_text)}
      {activeTab === 'three' && renderContent(post_reading)}
    </div>
  );
}
        
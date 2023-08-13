import React from 'react';

const apiKey = import.meta.env.VITE_APP_PLAYHT_API_KEY;

export function TextToVoice({ story_text, pre_reading, post_reading, voice, playAudio}) {
    const convertToSpeech = (text) => {
        playAudio(text, voice); // Call playAudio with text and voice
      };
      
  return (
    <div className="tab">
      <div className="paragraph-container">
        <button className="play-button" onClick={() => convertToSpeech(story_text)}>Play</button>
        <p>{story_text}</p>
      </div>
      <div className="paragraph-container">
        <button className="play-button" onClick={() => convertToSpeech(pre_reading)}>Play</button>
        <p>{pre_reading}</p>
      </div>
      <div className="paragraph-container">
        <button className="play-button" onClick={() => convertToSpeech(post_reading)}>Play</button>
        <p>{post_reading}</p>
      </div>
    </div>
  );
}

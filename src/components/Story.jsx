import { useCallback, useEffect, useRef, useState } from "react";
import generateAudio from "../lib/generateAudio";
import { useAudioMagnament } from "../context/AudioMagnament";

function PlayPauseButton({ onClick, disabled }) {
  return (
    <button className="play-button" onClick={onClick} disabled={disabled}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="seek">
        <g data-name="4">
          <path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,27A13,13,0,1,1,29,16,13,13,0,0,1,16,29Z"></path>
          <polygon points="17 15.38 10 11 10 21 17 16.63 17 21 19 21 19 11 17 11 17 15.38"></polygon>
          <rect width="2" height="10" x="21" y="11"></rect>
        </g>
      </svg>
    </button>
  )
}

export default function Story({ story }) {
  const lines = story.split('\n');
  const title = lines[0].trim();
  const paragraphs = lines.slice(1).filter((line) => line.trim() !== '');
  const { setAudioUrl, handlePlayPauseGenerate, isGenerating } = useAudioMagnament()

  useEffect(() => {
    if (!story) {
      return
    }
    setAudioUrl(null)
    console.log('audioUrl reset')
  }, [story])

  return (
    <div>
      <PlayPauseButton disabled={isGenerating} onClick={() => handlePlayPauseGenerate(story)} />
      <div id="story-window">
        {title && <h1>{title}</h1>}
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};
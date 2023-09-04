import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import generateAudio from '../lib/generateAudio';

const AudioMagnamentContext = createContext();

export function AudioMagnament({ children }) {

  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [voiceID, setVoiceID] = useState(null);
  const audioPlayerRef = useRef(null);


  useEffect(() => {
    if (!audioUrl) {
      return
    }
    handlePlay()

  }, [audioUrl])

  const handleGenerateAudio = async (text, voice) => {
    setIsGenerating(true)
    console.log('from handleGenerate', voiceID)
    const url = await generateAudio({ text, voice })
    setAudioUrl(url)
    setIsGenerating(false)
  }

  const handlePlay = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handlePlayPauseGenerate = useCallback((story) => {
    if (audioUrl) {
      if (isPlaying) handlePause()
      else handlePlay()
    } else handleGenerateAudio(story, voiceID)
  }, [audioUrl, isPlaying, voiceID])

  return (
    <AudioMagnamentContext.Provider value={{
      audioUrl,
      setAudioUrl,      
      setVoiceID,
      handlePlayPauseGenerate,
      isGenerating,
    }}>
      <audio ref={audioPlayerRef} src={audioUrl} className='audio-player' onEnded={handleAudioEnded} />
      {children}
    </AudioMagnamentContext.Provider>
  );
}

export function useAudioMagnament() {
  return useContext(AudioMagnamentContext);
}

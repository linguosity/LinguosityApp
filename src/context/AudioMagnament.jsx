import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import generateAudio from '../lib/generateAudio';

const AudioMagnamentContext = createContext();
const formatTime = (ms) => {
  let [min, sec] = (ms / 60).toFixed(2).split('.')
  sec = ((sec / 100) * 60).toFixed()
  sec = sec < 10 ? `0${sec}` : sec
  return `${min}:${sec}`
}

export function AudioMagnament({ children }) {

  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [voiceID, setVoiceID] = useState(null);
  const audioPlayerRef = useRef(null);
  console.log('audioPlayerRef', audioPlayerRef)

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

  const handlePause = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handlePlay = useCallback((story) => {
    if (audioUrl) {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    } else {
      handleGenerateAudio(story, voiceID)
    }
  }, [audioUrl, isPlaying, voiceID])

  return (
    <AudioMagnamentContext.Provider value={{
      audioUrl,
      setAudioUrl,      
      setVoiceID,
      handlePlay,
      handlePause,
      isGenerating,
      isPlaying,
      audioPlayerRef,
    }}>
      <audio ref={audioPlayerRef} src={audioUrl} className='audio-player' onEnded={handleAudioEnded} />
      {children}
    </AudioMagnamentContext.Provider>
  );
}

export function useAudioMagnament() {
  return useContext(AudioMagnamentContext);
}

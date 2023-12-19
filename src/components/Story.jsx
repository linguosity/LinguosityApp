import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import generateAudio from "../lib/generateAudio";
import { useAudioMagnament } from "../context/AudioMagnament";
import { Spinner } from "grommet";
import getPlanDetails from "../utils/getPlanDetails";
import { useFirebase } from "../context/FirebaseContext";


function PlayButton(props) {
  return (
    <button onClick={props.onClick} className="player-button">
      <svg fill="none" viewBox="0 0 24 24" height="1.5rem" width="1.5rem" {...props}>
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 2c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11z"
          clipRule="evenodd"
        />
        <path fill="currentColor" d="M16 12l-6 4.33V7.67L16 12z" />
      </svg>
    </button>
  );
}

function PauseButton(props) {
  return (
    <button onClick={props.onClick} className="player-button">
      <svg fill="none" viewBox="0 0 24 24" height="1.5rem" width="1.5rem" {...props}>
        <path fill="currentColor" d="M9 9h2v6H9V9zM15 15h-2V9h2v6z" />
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11zm-2 0a9 9 0 11-18 0 9 9 0 0118 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
const formatTime = (ms) => {
  if (!ms) return "00:00"
  let [min, sec] = (ms / 60).toFixed(2).split('.')
  sec = ((sec / 100) * 60).toFixed()
  sec = sec < 10 ? `0${sec}` : sec
  return `${min}:${sec}`
}
export default function Story({ story, imageUrl }) {
  const lines = story.split('\n');
  let title = lines[0].trim();
  title = title.endsWith('.') ? title : title + '.'; // Add period if not present
  const paragraphs = lines.slice(1).map(line => line.trim().endsWith('.') ? line.trim() : line.trim() + '.').filter(line => line !== '');
  const { setAudioUrl, handlePlay, handlePause, isGenerating, isPlaying, audioPlayerRef, audioUrl } = useAudioMagnament()
  const [currentTime, setCurrentTime] = useState(0); // State to store current time
  const [audioDuration, setAudioDuration] = useState(0); // State to store audio duration
  const [showFullscreenButton, setShowFullscreenButton] = useState(false);

  useEffect(() => {
    // Check if there's any non-empty <p> tag inside #story-window
    const hasText = paragraphs.some(paragraph => paragraph.trim() !== "");
    setShowFullscreenButton(hasText);
  }, [paragraphs]);
  
  useEffect(() => {
    if (!audioPlayerRef.current) return
    // Subscribe to changes in currentTime and duration
    const updateTime = () => {
      setCurrentTime(audioPlayerRef.current.currentTime);
      setAudioDuration(audioPlayerRef.current.duration);
    };

    // Add event listeners for time updates
    audioPlayerRef.current.addEventListener('timeupdate', updateTime);

    // Remove event listener when the component unmounts
    return () => {
      audioPlayerRef.current.removeEventListener('timeupdate', updateTime);
    };
  }, [audioPlayerRef]);


  const { userData } = useFirebase()
  const isAllowedTextToSpeech = useMemo(() => {
    if (!userData) return false
    const planDetails = getPlanDetails(userData.plan)
    return planDetails.textToSpeech
  }, [userData])

  const handleFullScreenClick = () => {
    const storyWindow = document.getElementById("story-window");

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      storyWindow.requestFullscreen();
    }
  };

  return (
    <div>
      {
        story && isAllowedTextToSpeech && (
          <div className="story-player">
            {isPlaying ? <PauseButton onClick={handlePause} /> : <PlayButton onClick={() => handlePlay(story)} />}
            {audioUrl && <span className="text-sm">{`${formatTime(currentTime)} / ${formatTime(audioDuration)}`}</span>}
          </div>
        )
      }
      {showFullscreenButton && <button onClick={handleFullScreenClick}>[Fullscreen]</button>}
      <div id="story-window">

      {imageUrl && <img src={imageUrl} alt="Generated" />}  {/* Display the image */}
        {title && <h1>{title}</h1>}
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
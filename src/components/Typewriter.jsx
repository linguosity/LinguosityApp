import React, { useState, useEffect } from 'react';

function Typewriter({message, setIsTyping}) { // Receive setIsTyping as a prop
  const [text, setText] = useState('');
  const [isTypingState, setIsTypingState] = useState(true);

  useEffect(() => {
    setIsTyping(true); // Start typing
    let typingInterval = setInterval(() => {
      if (text.length < message.length) {
        setText((prevText) => prevText + message[prevText.length]);
      } else {
        setIsTypingState(false);
        setIsTyping(false); // Finish typing
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, [message]);

  return (
    <div>
      {text}
      {isTypingState && <span className="typing-indicator">|</span>}
    </div>
  );
}

export default Typewriter;

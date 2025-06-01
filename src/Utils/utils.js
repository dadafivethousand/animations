import React, { useEffect, useState } from "react";
 
function Typewriter({ text = "", typingSpeed = 100, delay = 0, className = "" }) {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let i = 0;
    let typingInterval;

    const startTyping = () => {
      typingInterval = setInterval(() => {
        setTypedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(typingInterval);
        }
      }, typingSpeed);
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearInterval(typingInterval);
    };
  }, [text, typingSpeed, delay]);

  return (
    <span className={className}>{typedText}</span>
  );
}

export default Typewriter;

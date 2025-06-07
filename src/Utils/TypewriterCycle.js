import React, { useState, useEffect } from "react";

export default function TypewriterCycle({ texts, typingSpeed = 100, deletingSpeed = 50, pauseTime = 1000 }) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    const fullText = texts[currentIndex];
    
    if (isDeleting) {
      timeout = setTimeout(() => {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText.length - 1 === 0) {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }, deletingSpeed);
    } else {
      if (currentText.length < fullText.length) {
        timeout = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, texts, currentIndex, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span>{currentText}</span>
  );
}

import React, { useState, useEffect } from "react";

export default function TypewriterCycle({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1000,
  startDelay = 0, // ⬅️ new prop
}) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(startDelay === 0); // ⬅️ control start

  // Handle initial delay
  useEffect(() => {
    if (startDelay > 0) {
      const delayTimer = setTimeout(() => setStarted(true), startDelay);
      return () => clearTimeout(delayTimer);
    }
  }, [startDelay]);

  useEffect(() => {
    if (!started) return; // wait until delay is done

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
      }  
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, texts, currentIndex, typingSpeed, deletingSpeed, pauseTime, started]);

  return <span>{currentText}</span>;
}

import { useEffect, useState } from "react";
import "../Stylesheets/ReasonsFlash.css";

const outcomes = [
  "You’ll walk taller.",
  "You’ll eat better.",
  "You’ll stop avoiding eye contact.",
  "You’ll get stronger — physically and mentally.",
  "You’ll show up when it’s hard.",
  "You’ll learn to stay calm in chaos.",
  "You’ll make friends who grind just like you.",
  "You’ll finally believe in yourself.",
  "You’ll tap. A lot. Then you’ll get back up.",
  "You’ll stop doubting yourself.",
  "You’ll start pushing yourself.",
  "You’ll feel your body changing.",
  "You’ll stop chasing comfort.",
  "You’ll fight for every inch.",
  "You’ll stop being scared of confrontation.",
  "You’ll learn to breathe through pressure.",
  "You’ll learn how to lose — and why that’s powerful.",
  "You’ll take up space.",
  "You’ll sweat through your insecurities.",
  "You’ll stop making excuses.",
  "You’ll become someone your younger self would respect.",
  "You’ll stop looking for motivation and start building discipline.",
  "You’ll find peace in the middle of a storm.",
  "You’ll learn to protect yourself.",
  "You’ll stop trying to impress people.",
  "You’ll earn respect the right way.",
  "You’ll realize no one is coming to save you.",
  "You’ll become your own weapon.",
  "You’ll get choked... and you’ll smile after.",
  "You’ll become harder to kill.",
  "You’ll become someone you’re proud of.",
  "You’ll change."
];

export default function ReasonsFlash() {
  const [index, setIndex] = useState(0);
  const [delay, setDelay] = useState(400);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    if (index >= outcomes.length - 1) {
      setStopped(true);
      return;
    }

    const timeout = setTimeout(() => {
      setIndex((prev) => prev + 1);

      // Speed curve
      if (index < 3) setDelay(700);         // Dramatic open
      else if (index < 25) setDelay(50);    // Machine gun midsection
      else if (index < 30) setDelay(180);   // Slow build
      else setDelay(2500);                  // Final pause

    }, delay);

    return () => clearTimeout(timeout);
  }, [index, delay]);

  return (
    <div className="reason-flash-container">
      <div className={`reason-text ${stopped ? "final" : "flash"}`}>
        {outcomes[index]}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/CodeSchedule.css";

export default function CodeSchedule({ day, animationDelay = 800, typingSpeed = 40 }) {
  const [typedCode, setTypedCode] = useState("");
  const [fullCode, setFullCode] = useState("");

  useEffect(() => {
    const entries = schedule[day] || [];
    let code = `.${day.toLowerCase()}-schedule {\n`;
    entries.forEach((cls) => {
      const key = cls.name.replace(/\s+/g, '-');
      const time = formatTime(cls.start);
      code += `  ${key}: ${time};\n`;
    });
    code += `}`;
    setFullCode(code);
  }, [day]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setTypedCode(fullCode.substring(0, i + 1));
        i++;
        if (i > fullCode.length) clearInterval(interval);
      }, typingSpeed);
      return () => clearInterval(interval);
    }, animationDelay);
    return () => clearTimeout(timeout);
  }, [fullCode, typingSpeed, animationDelay]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="code-editor-container">
      <div className="blurred-code-background">
        <div><span className="code-keyword">function</span> <span className="code-function">train</span>() {'{'}</div>
        <div>&nbsp;&nbsp;<span className="code-keyword">let</span> <span className="code-variable">tapCount</span> = <span className="code-number">0</span>;</div>
        <div>&nbsp;&nbsp;<span className="code-keyword">while</span> (<span className="code-boolean">true</span>) {'{'}</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-function">sweep</span>();</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-variable">tapCount</span>++;</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">if</span> (<span className="code-variable">tapCount</span> &gt; <span className="code-number">9000</span>) <span className="code-keyword">break</span>;</div>
        <div>&nbsp;&nbsp;{'}'}</div>
        <div>&nbsp;&nbsp;<span className="code-keyword">return</span> <span className="code-string">'blackbelt'</span>;</div>
        <div>{'}'}</div>
        <br />
        <div><span className="code-keyword">const</span> <span className="code-variable">giClass</span> = <span className="code-string">'7:30AM'</span>;</div>
        <div><span className="code-keyword">const</span> <span className="code-variable">nogiClass</span> = <span className="code-string">'12:00PM'</span>;</div>
        <div><span className="code-comment">// Remember to shrimp before you bridge</span></div>
        <div><span className="code-function">console</span>.log(<span className="code-string">'oss!'</span>);</div>
        <div><span className="code-keyword">export</span> <span className="code-keyword">default</span> <span className="code-variable">train</span>;</div>
     <div><span className="code-keyword">function</span> <span className="code-function">train</span>() {'{'}</div>
        <div>&nbsp;&nbsp;<span className="code-keyword">let</span> <span className="code-variable">tapCount</span> = <span className="code-number">0</span>;</div>
        <div>&nbsp;&nbsp;<span className="code-keyword">while</span> (<span className="code-boolean">true</span>) {'{'}</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-function">sweep</span>();</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-variable">tapCount</span>++;</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">if</span> (<span className="code-variable">tapCount</span> &gt; <span className="code-number">9000</span>) <span className="code-keyword">break</span>;</div>
        <div>&nbsp;&nbsp;{'}'}</div>
        <div>&nbsp;&nbsp;<span className="code-keyword">return</span> <span className="code-string">'blackbelt'</span>;</div>
        <div>{'}'}</div>
        <br />
        <div><span className="code-keyword">const</span> <span className="code-variable">giClass</span> = <span className="code-string">'7:30AM'</span>;</div>
        <div><span className="code-keyword">const</span> <span className="code-variable">nogiClass</span> = <span className="code-string">'12:00PM'</span>;</div>
        <div><span className="code-comment">// Remember to shrimp before you bridge</span></div>
        <div><span className="code-function">console</span>.log(<span className="code-string">'oss!'</span>);</div>
        <div><span className="code-keyword">export</span> <span className="code-keyword">default</span> <span className="code-variable">train</span>;</div>
     
      </div>

      <pre className="focused-code">
        <code>{typedCode}</code>
      </pre>
    </div>
  );
}

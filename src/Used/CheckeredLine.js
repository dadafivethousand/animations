import React from 'react';
import '../Stylesheets/CheckeredLine.css';
import { useState, useEffect } from 'react';

export default function CheckeredLine() {
  const rows = 150;
  const cols = 13;
  const [showBoard, setShowBoard] = useState(false)

  useEffect(()=>{
 setTimeout(() => {
    setShowBoard(true)
 }, 2000);
  },[])

  const divs = Array.from({ length: rows }, (_, rowIndex) => (
    <div key={rowIndex} className="div-row">
      {Array.from({ length: cols }, (_, colIndex) => {
        const isWhite = (rowIndex + colIndex) % 2 === 0;
        const baseClass = isWhite ? 'white' : 'black';

        return (
          <div
            key={colIndex}
            className={`my-div ${baseClass}`}
            style={{
              animationDelay: `${rowIndex * 150}ms`
            }}
          />
        );
      })}
    </div>
  ));

  return (
    <div className="outercontainer">
  {  showBoard?  <div className="div-container">{divs}</div> : null}    </div>
  );
}

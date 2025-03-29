import React, { useState, useEffect } from 'react';
import '../Stylesheets/CheckeredLine.css';
 

export default function CheckeredLine() {

    const [gradientPositions, setGradientPositions] = useState([0, 85, 100]);
  const rows = 100; // Number of rows
  const cols = 100 // Number of columns per row

  //useEffect(() => {
   // const animations = Array.from({ length:170 }, (_, i) => [
     //   0,    // Start of black (always 0)
     //   i,    // Moving edge of black (sweeps from 0 to 100)
    //    i + 1 // Start of white (always just after the black)
     // ]);

    let currentIndex = 0;
    let cycles = 0;
  

   /* const intervalId = setInterval(() => {
        if (currentIndex >= 100) {
            clearInterval(intervalId);
            return;
          }
      setGradientPositions(animations[currentIndex]);
      currentIndex = (currentIndex + 1) 
    }, 40); // Change every 100ms

    return () => clearInterval(intervalId);
  }, []); */
  useEffect(() => {
    const [pos1, pos2, pos3] = gradientPositions;
    document.documentElement.style.setProperty('--pos1', `${pos1}%`);
    document.documentElement.style.setProperty('--pos2', `${pos2}%`);
    document.documentElement.style.setProperty('--pos3', `${pos3}%`);
  }, [gradientPositions]);

  const divs = Array.from({ length: rows }, (_, rowIndex) => (
    <div key={rowIndex} className="div-row">
      {Array.from({ length: cols }, (_, colIndex) => (
        <div key={colIndex} className={`my-div ${(rowIndex + colIndex) % 2 === 0 ? 'white' : 'black'}`}></div>
      ))}
    </div>
  ));

  return (<div className='outercontainer'>
  
    
    <div className='gradient'></div>
    <div className="div-container">
        
       
      {divs}
    </div>
   
    </div>
  );
}
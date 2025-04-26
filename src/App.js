import React from "react";
import './Stylesheets/App.css'
 
import GameBoy from "./Components/Gameboy"
import GameBoySchedule from "./Components/GameboySchedule"
 
   
 function App() {
  return (
    <>
    < GameBoySchedule day="Monday" />
   </>
  );
}

export default App;


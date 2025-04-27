import React from "react";
import './Stylesheets/App.css'
 
import GameBoy from "./Components/Gameboy"
import GameBoySchedule from "./Components/GameboySchedule"
import CrazyFrogSchedule from "./Components/CrazyFrogSchedule"
   
 function App() {
  return (
    <>
    < CrazyFrogSchedule day="Tuesday" />
   </>
  );
}

export default App;


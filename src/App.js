import React from "react";
import './Stylesheets/App.css'
 
import GameBoy from "./Components/Gameboy"
import GameBoySchedule from "./Components/GameboySchedule"
import CrazyFrogSchedule from "./Components/CrazyFrogSchedule"
import JurassicSchedule from "./Components/JurassicSchedule";
import OfficeSchedule from "./Components/OfficeSchedule"
import TokyoSchedule from "./Components/TokyoSchedule";
   
 function App() {
  return (
    <>
    < TokyoSchedule day="Wednesday" />
   </>
  );
}

export default App;


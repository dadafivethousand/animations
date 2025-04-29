import React from "react";
import './Stylesheets/App.css'
 
import GameBoy from "./Components/Gameboy"
import GameBoySchedule from "./Components/GameboySchedule"
import CrazyFrogSchedule from "./Components/CrazyFrogSchedule"
import JurassicSchedule from "./Components/JurassicSchedule";
import OfficeSchedule from "./Components/OfficeSchedule"
   
 function App() {
  return (
    <>
    < OfficeSchedule day="Tuesday" />
   </>
  );
}

export default App;


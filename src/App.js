import React from "react";
import './Stylesheets/App.css'
 
import GameBoy from "./Components/Gameboy"
import GameBoySchedule from "./Components/GameboySchedule"
import CrazyFrogSchedule from "./Components/CrazyFrogSchedule"
import JurassicSchedule from "./Components/JurassicSchedule";
import OfficeSchedule from "./Components/OfficeSchedule"
import TokyoSchedule from "./Components/TokyoSchedule";
import StrangerSchedule from "./Components/StrangerSchedule";
import CasinoSchedule from "./Components/CasinoSchedule";
   
 function App() {
  return (
    <>
    < CasinoSchedule day="Wednesday" />
   </>
  );
}

export default App;


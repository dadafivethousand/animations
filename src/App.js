import React from "react";
import './Stylesheets/App.css';
 import JoeRoganSchedule from"./Components/JoeRoganSchedule"
 
import Poster from "./Components/Poster"
import LuxuryJewelrySchedule from "./Components/LuxuryJewelrySchedule";
import EspnSchedule from "./Components/EspnSchedule";
import AvatarSchedule from "./Components/AvatarSchedule";
import AITerminalSchedule from "./Components/AITerminalSchedule"
import MapleJiuJitsuHeader from "./Components/MapleJiuJitsuHeader";
import TimHortonsSchedule from "./Components/TimHortonsSchedule";
import GrandOpening from "./Components/GrandOpening";
 

function App() {
  return (
    <>
       <GrandOpening />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

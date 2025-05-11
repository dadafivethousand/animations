import React from "react";
import './Stylesheets/App.css';

 
import FerrariSchedule from "./Components/FerrariSchedule";
import PeakySchedule from "./Components/PeakySchedule";
import CsgoSchedule from "./Components/CsgoSchedule";
import TopGunSchedule from "./Components/TopGunSchedule";
import CockpitSchedule from "./Components/CockpitSchedule";
import ApesSchedule from "./Components/ApesSchedule";
import ZeldaSchedule from "./Components/ZeldaSchedule";
 import FlappySchedule from "./Components/FlappySchedule";
import TekkenSchedule from "./Components/TekkenSchedule";
import GucciSchedule from "./Components/GucciSchedule";
import CaptainAmericaSchedule from "./Components/CaptainAmericaSchedule"
import AlienSchedule from "./Components/AlienSchedule"
import GraffitiSchedule from "./Components/GraffitiSchedule";
import GladiatorSchedule from "./Components/GladiatorSchedule";
import RockSchedule from "./Components/RockSchedule";

  

function App() {
  return (
    <>
      <RockSchedule day="Monday" />

      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

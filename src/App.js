import React from "react";
import "./Stylesheets/App.css"
import MonopolySchedule from "./Components/MonopolySchedule";
import CanadaSchedule from "./Components/CanadaSchedule";
import BoratSchedule from "./Components/BoratSchedule";
import GoldenSchedule from "./Components/GoldenSchedule";
import PharaohSchedule from "./Components/PharaohSchedule";
import JayZSchedule from "./Components/JayZSchedule";
import NASCARSchedule from "./Components/NASCARSchedule";
import YoungJeezySchedule from "./Components/YoungJeezySchedule"
import ApesSchedule from "./Used/ApesSchedule";
import UsainBoltSchedule from "./Used/UsainBoltSchedule"
import BuzzSchedule from "./Used/BuzzSchedule";
import RoboCopSchedule from "./Components/RoboCopSchedule"
import PandaSchedule from "./Components/PandaSchedule";
import BadBoysSchedule from "./Components/BadBoysSchedule";
import VisionSchedule from "./Components/VisionSchedule";
import ShmurdaSchedule from "./Components/ShmurdaSchedule";


function App() {
  return (
    <>
       < PandaSchedule day="Monday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
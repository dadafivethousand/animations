import React from "react";
import "./Stylesheets/App.css"
 
 
import BrockSchedule from "./Components/BrockSchedule";
import TrueReligionSchedule from "./Components/TrueReligionSchedule";
import SafariSchedule from "./Components/SafariSchedule";
import ADCCSchedule from "./Components/ADCCSchedule";
import MonstersIncSchedule from "./Components/MonstersIncSchedule"
import TransformersSchedule from "./Used/TransformersSchedule";
import VegasSchedule from "./Used/VegasSchedule";
import StreetFighterSchedule from "./Used/StreetFighterSchedule";

function App() {
  return (
    <>
  <StreetFighterSchedule   day={"Monday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
import React from "react";
import "./Stylesheets/App.css"
import NirvanaSchedule from "./Components/NirvanaSchedule";
import JonJonesSchedule from "./Components/JonJonesSchedule";
 
import HappyDadSchedule from "./Components/HappyDadSchedule"
import PinkPantherSchedule from "./Components/PinkPantherSchedule";
import SpiderManSchedule from "./Used/SpiderManSchedule"
import BoneCrusherSchedule from "./Components/BoneCrusherSchedule";
import TonyHawkSchedule from "./Components/TonyHawkSchedule";
function App() {
  return (
    <>
  <TonyHawkSchedule day={"Thursday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
import React from "react";
import "./Stylesheets/App.css"
import NirvanaSchedule from "./Components/NirvanaSchedule";
import JonJonesSchedule from "./Components/JonJonesSchedule";
 
import HappyDadSchedule from "./Components/HappyDadSchedule"
import PinkPantherSchedule from "./Components/PinkPantherSchedule";
import SpiderManSchedule from "./Used/SpiderManSchedule"
import BoneCrusherSchedule from "./Components/BoneCrusherSchedule";
import TonyHawkSchedule from "./Components/TonyHawkSchedule";
import FamilyGuySchedule from "./Used/FamilyGuySchedule";
import JokerSchedule from "./Used/JokerSchedule"
import BlueJaysSchedule from "./Components/BlueJaysSchedule";
import FarmSchedule from "./Used/FarmSchedule";
function App() {
  return (
    <>
  <BlueJaysSchedule day={"Saturday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
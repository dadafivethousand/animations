import React from "react";
import "./Stylesheets/App.css"
import NirvanaSchedule from "./Components/NirvanaSchedule";
import JonJonesSchedule from "./Components/JonJonesSchedule";
 
import HappyDadSchedule from "./Components/HappyDadSchedule"
import PinkPantherSchedule from "./Components/PinkPantherSchedule";
import SpiderManSchedule from "./Used/SpiderManSchedule"
function App() {
  return (
    <>
  <SpiderManSchedule day={"Tuesday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
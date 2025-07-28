import React from "react";
import "./Stylesheets/App.css"
 
import MetallicaSchedule from "./Components/MetallicaSchedule";
import LittleEinsteinsSchedule from "./Components/LittleEinsteinsSchedule";
import WuTangSchedule from "./Components/WuTangSchedule";
import BingoSchedule from "./Components/BingoSchedule";
import FbiSchedule from "./Used/FBISchedule"
import FlinstoneSchedule from "./Used/FlintstoneSchedule"
function App() {
  return (
    <>
  <FlinstoneSchedule day={"Monday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
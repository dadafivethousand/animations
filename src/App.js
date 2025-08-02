import React from "react";
import "./Stylesheets/App.css"
import ScoobySchedule from "./Used/ScoobySchedule";
import GameOfThronesSchedule from "./Used/GameOfThronesSchedule";
import AsapRockySchedule from "./Used/ASAPRockySchedule"
import GladiatorSchedule from "./Used/GladiatorSchedule";



function App() {
  return (
    <>
  <GladiatorSchedule day={"Saturday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
import React from "react";
import "./Stylesheets/App.css"
 
import HelloKittySchedule from "./Components/HelloKittySchedule"
import KarateKidSchedule from "./Components/KarateKidSchedule";
import TourDeFranceSchedule from "./Components/TourDeFranceSchedule";
 
import MinionSchedule from "./Components/MinionSchedule";
import MonstersIncSchedule from "./Components/MonstersIncSchedule";
import WorldStarSchedule from "./Components/WorldStarSchedule";
import StackOverflowSchedule from "./Components/StackOverflowSchedule";
 import MachineSchedule from "./Components/MachineSchedule";


function App() {
  return (
    <>
  <MachineSchedule day={"Monday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
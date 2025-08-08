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
import MachineGunSchedule from "./Components/MachineGunSchedule";
import DanaherSchedule from "./Components/DanaherSchedule";
import DJKhaledSchedule from "./Used/DJKhaledSchedule";
import GraffitiSchedule from "./Used/GraffitiSchedule";
import SpotifySchedule from "./Used/SpotifySchedule"; 
import UncleSamSchedule from "./Used/UncleSamSchedule";

function App() {
  return (
    <>
  <StackOverflowSchedule day={"Friday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
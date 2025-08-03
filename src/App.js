import React from "react";
import "./Stylesheets/App.css"
 
import HelloKittySchedule from "./Components/HelloKittySchedule"
import KarateKidSchedule from "./Components/KarateKidSchedule";
import TourDeFranceSchedule from "./Components/TourDeFranceSchedule";
 
import MinionSchedule from "./Components/MinionSchedule";
import MonstersIncSchedule from "./Components/MonstersIncSchedule";
import WorldStarSchedule from "./Components/WorldStarSchedule";
import StackOverflowSchedule from "./Components/StackOverflowSchedule";
import RHAnnouncement from "./Components/RHAnnouncement";


function App() {
  return (
    <>
  <RHAnnouncement day={"Wednesday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
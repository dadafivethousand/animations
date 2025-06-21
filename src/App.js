import React from "react";
import "./Stylesheets/App.css"
 
import WarcraftSchedule from "./Used/WarcraftSchedule";
import VegasSchedule from "./Components/VegasSchedule";
import KingKongSchedule from "./Used/KingKongSchedule";
import CyanCatSchedule from "./Components/CyanCatSchedule"

function App() {
  return (
    <>
       <CyanCatSchedule day="Saturday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
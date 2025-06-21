import React from "react";
import "./Stylesheets/App.css"
 
import WarcraftSchedule from "./Used/WarcraftSchedule";
import VegasSchedule from "./Components/VegasSchedule";
import KingKongSchedule from "./Used/KingKongSchedule";
import CyanCatSchedule from "./Components/CyanCatSchedule"
import DBZSchedule from "./Used/DBZSchedule";

function App() {
  return (
    <>
       <DBZSchedule day="Saturday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
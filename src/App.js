import React from "react";
import "./Stylesheets/App.css"
import ArmyCamoSchedule from "./Components/ArmyCamoSchedule";
import YoungJeezySchedule from "./Components/YoungJeezySchedule";
import HockeySchedule from "./Components/HockeySchedule";
 import VegasSchedule from "./Components/VegasSchedule";

function App() {
  return (
    <>
       <VegasSchedule day="Tuesday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

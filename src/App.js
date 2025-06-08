import React from "react";
import "./Stylesheets/App.css"
import ArmyCamoSchedule from "./Components/ArmyCamoSchedule";
import YoungJeezySchedule from "./Components/YoungJeezySchedule";
import HockeySchedule from "./Components/HockeySchedule";
import UndertakerSchedule from "./Components/UndertakerSchedule";

function App() {
  return (
    <>
       <UndertakerSchedule day="Monday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

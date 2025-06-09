import React from "react";
import "./Stylesheets/App.css"
import ArmyCamoSchedule from "./Components/ArmyCamoSchedule";
import YoungJeezySchedule from "./Components/YoungJeezySchedule";
import HockeySchedule from "./Components/HockeySchedule";
 import VegasSchedule from "./Components/VegasSchedule";
import Carter3Schedule from "./Components/Carter3Schedule";
import MatrixSchedule from "./Used/Lit/MatrixSchedule"

function App() {
  return (
    <>
       < MatrixSchedule day="Tuesday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

import React from "react";
import "./Stylesheets/App.css"
import ArmyCamoSchedule from "./Components/ArmyCamoSchedule";
import YoungJeezySchedule from "./Components/YoungJeezySchedule";
import HockeySchedule from "./Components/HockeySchedule";
 import VegasSchedule from "./Components/VegasSchedule";
import Carter3Schedule from "./Used/Carter3Schedule";
import MatrixSchedule from "./Used/Lit/MatrixSchedule"
import MarioSchedule from "./Used/Lit/MarioSchedule"
import PokemonSchedule from "./Used/Lit/PokemonSchedule"

function App() {
  return (
    <>
       < PokemonSchedule day="Wednesday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

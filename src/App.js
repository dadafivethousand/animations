import React from "react";
import "./Stylesheets/App.css"
 
import YoungJeezySchedule from "./Components/YoungJeezySchedule";
import HockeySchedule from "./Components/HockeySchedule";
 import VegasSchedule from "./Components/VegasSchedule";
 
import MatrixSchedule from "./Used/Lit/MatrixSchedule"
import MarioSchedule from "./Used/Lit/MarioSchedule"
import PokemonSchedule from "./Used/Lit/PokemonSchedule"
import TravisBarkerSchedule from "./Components/TravisBarkerSchedule";


function App() {
  return (
    <>
       < TravisBarkerSchedule day="Thursday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

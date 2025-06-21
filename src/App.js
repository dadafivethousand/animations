import React from "react";
import "./Stylesheets/App.css"
 
import WarcraftSchedule from "./Used/WarcraftSchedule";
import VegasSchedule from "./Components/VegasSchedule";
import KingKongSchedule from "./Used/KingKongSchedule";
 import DBZSchedule from "./Used/DBZSchedule";
import CreditCardSchedule from "./Components/CreditCardSchedule";
import WolverineSchedule from "./Used/Lit/WolverineSchedule";
import CadillacSchedule from "./Components/CadillacSchedule";
import Six9ineSchedule from "./Components/SixNineSchedule";
import OvoSchedule from "./Components/OvoSchedule";
import MichaelJacksonSchedule from "./Components/MichaelJacksonSchedule";

function App() {
  return (
    <>
       <MichaelJacksonSchedule day="Monday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
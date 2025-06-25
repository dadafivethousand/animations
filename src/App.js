import React from "react";
import "./Stylesheets/App.css"
 
import WarcraftSchedule from "./Used/WarcraftSchedule";
 import KingKongSchedule from "./Used/KingKongSchedule";
 import DBZSchedule from "./Used/DBZSchedule";
 import WolverineSchedule from "./Used/Lit/WolverineSchedule";
import CadillacSchedule from "./Components/CadillacSchedule";
import Six9ineSchedule from "./Components/SixNineSchedule";
import OvoSchedule from "./Components/OvoSchedule";
import MichaelJacksonSchedule from "./Components/MichaelJacksonSchedule";
import RockySchedule from "./Components/RockySchedule";
import BatmanSchedule from "./Used/BatmanSchedule"
import TokyoSchedule from "./Components/TokyoSchedule"
import BlackPantherSchedule from "./Used/BlackPantherSchedule";

function App() {
  return (
    <>
       < BlackPantherSchedule day="Wednesday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
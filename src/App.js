import React from "react";
import "./Stylesheets/App.css"
import AirForceOnesSchedule from "./Components/AirForceOnesSchedule";
import AiTerminalSchedule from "./Used/Lit/AITerminalSchedule"
 

function App() {
  return (
    <>
       < AiTerminalSchedule day="Monday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
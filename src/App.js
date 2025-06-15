import React from "react";
import "./Stylesheets/App.css"
 
 import CoffinSchedule from "./Used/Lit/CoffinSchedule"
import Six9ineSchedule from "./Components/SixNineSchedule";


function App() {
  return (
    <>
       < CoffinSchedule day="Monday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

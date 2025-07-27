import React from "react";
import "./Stylesheets/App.css"
 
import MetallicaSchedule from "./Components/MetallicaSchedule";
import LittleEinsteinsSchedule from "./Components/LittleEinsteinsSchedule";
function App() {
  return (
    <>
  <LittleEinsteinsSchedule day={"Monday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
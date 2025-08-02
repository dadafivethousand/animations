import React from "react";
import "./Stylesheets/App.css"
import ScoobySchedule from "./Used/ScoobySchedule";
 
 
import AsapRockySchedule from "./Used/ASAPRockySchedule"
function App() {
  return (
    <>
  <ScoobySchedule day={"Saturday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
import React from "react";
import "./Stylesheets/App.css"
import NirvanaSchedule from "./Components/NirvanaSchedule";
import JonJonesSchedule from "./Components/JonJonesSchedule";
 
import HappyDadSchedule from "./Components/HappyDadSchedule"
import PinkPantherSchedule from "./Components/PinkPantherSchedule";
function App() {
  return (
    <>
  <PinkPantherSchedule day={"Monday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
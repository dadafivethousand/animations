import React from "react";
import "./Stylesheets/App.css"
 
import WarcraftSchedule from "./Used/WarcraftSchedule";
import VegasSchedule from "./Components/VegasSchedule";
import KingKongSchedule from "./Used/KingKongSchedule";

function App() {
  return (
    <>
       <KingKongSchedule day="Friday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
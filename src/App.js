import React from "react";
import "./Stylesheets/App.css"
import GatoradeSchedule from "./Components/GatoradeSchedule";
import VenomSchedule from "./Used/VenomSchedule"
import HockeySchedule from "./Components/HockeySchedule";
 


function App() {
  return (
    <>
       <HockeySchedule day="Wednesday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

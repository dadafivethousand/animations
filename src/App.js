import React from "react";
import "./Stylesheets/App.css"
 
import MarleySchedule from "./Components/MarleySchedule";
import MysterioSchedule from "./Components/MysterioSchedule";
import RaptorsSchedule from "./Components/RaptorsSchedule"
import PabloSchedule from "./Components/PabloSchedule";
import IceAgeSchedule from "./Components/IceAgeSchedule";
import RingSchedule from "./Components/RingSchedule";
function App() {
  return (
    <>
  <RingSchedule day={"Monday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
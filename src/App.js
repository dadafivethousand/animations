import React from "react";
import './Stylesheets/App.css';

 
import FerrariSchedule from "./Components/FerrariSchedule";
import PeakySchedule from "./Components/PeakySchedule";
import CsgoSchedule from "./Components/CsgoSchedule";
import TopGunSchedule from "./Components/TopGunSchedule";
import CockpitSchedule from "./Components/CockpitSchedule";
import ApesSchedule from "./Components/ApesSchedule";
import ZeldaSchedule from "./Components/ZeldaSchedule";
 

function App() {
  return (
    <>
      <ZeldaSchedule day="Wednesday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

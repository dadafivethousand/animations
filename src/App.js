import React from "react";
import './Stylesheets/App.css';
 
import InuyashaSchedule from "./Components/InuyashaSchedule"
import DonkeyKongSchedule from "./Components/DonkeyKongSchedule";
import BoxSchedule from "./Components/BoxSchedule";
import DiorSchedule from "./Components/DiorSchedule";
import Spray from "./Components/Spray";

  

function App() {
  return (
    <>
      < DiorSchedule day="Thursday" />

      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

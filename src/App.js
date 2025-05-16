import React from "react";
import './Stylesheets/App.css';
 
import InuyashaSchedule from "./Components/InuyashaSchedule"
import DonkeyKongSchedule from "./Components/DonkeyKongSchedule";
import BoxSchedule from "./Components/BoxSchedule";
import DiorSchedule from "./Components/DiorSchedule";
import Spray from "./Components/Spray";
import SpotifySchedule from "./Components/SpotifySchedule";
import WolfSchedule from "./Components/WolfSchedule";
 
  

function App() {
  return (
    <>
      < WolfSchedule day="Saturday" />

      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

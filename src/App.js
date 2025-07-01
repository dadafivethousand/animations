import React from "react";
import "./Stylesheets/App.css"
import MonopolySchedule from "./Components/MonopolySchedule";
import CanadaSchedule from "./Components/CanadaSchedule";
import BoratSchedule from "./Components/BoratSchedule";
import GoldenSchedule from "./Components/GoldenSchedule";
import PharaohSchedule from "./Components/PharaohSchedule";
import JayZSchedule from "./Components/JayZSchedule";
import NASCARSchedule from "./Components/NASCARSchedule";



function App() {
  return (
    <>
       < BoratSchedule day="Tuesday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
import React from "react";
import './Stylesheets/App.css'
import GodfatherSchedule from "./Components/GodfatherSchedule";
import HulkamaniaSchedule from "./Components/HulkamaniaSchedule";
import HospitalSignSchedule from "./Components/HospitalSignSchedule";
import GameOfThronesSchedule from "./Components/GameOfThronesSchedule";
function App() {
  return (
    <>
  <HospitalSignSchedule day="Friday" />
  <GameOfThronesSchedule day="Friday" />
  </>
  );
}

export default App;


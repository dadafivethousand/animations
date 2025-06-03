import React from "react";
import './Stylesheets/App.css';
 import JoeRoganSchedule from"./Components/JoeRoganSchedule"
 
import Poster from "./Components/Poster"
import LuxuryJewelrySchedule from "./Components/LuxuryJewelrySchedule";
import EspnSchedule from "./Components/EspnSchedule";
  

function App() {
  return (
    <>
      < EspnSchedule day="Wednesday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

import React from "react";
import './Stylesheets/App.css';
 
import VegasSchedule from "./Components/VegasSchedule"
import NightclubSchedule from "./Components/NightClubSchedule";
import JoeRoganSchedule from "./Components/JoeRoganSchedule"
import AlienSchedule from "./Components/AlienSchedule"
  
  

function App() {
  return (
    <>
      < AlienSchedule day="Saturday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

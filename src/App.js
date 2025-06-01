import React from "react";
import './Stylesheets/App.css';
 
import VegasSchedule from "./Components/VegasSchedule"
import NightclubSchedule from "./Components/NightClubSchedule";
import JoeRoganSchedule from "./Components/JoeRoganSchedule"
import AlienSchedule from "./Components/AlienSchedule"
import gothicSchedule from "./Components/GothicSchedule"
  
  

function App() {
  return (
    <>
      < GothicSchedule day="Sunday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

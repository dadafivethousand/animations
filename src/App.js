import React from "react";
import './Stylesheets/App.css';
 
import VegasSchedule from "./Components/VegasSchedule"
import NightclubSchedule from "./Components/NightClubSchedule";
  
  

function App() {
  return (
    <>
      < NightclubSchedule day="Friday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

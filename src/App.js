import React from "react";
import './Stylesheets/App.css'
import SimpsonsSchedule from "./Components/SimpsonsSchedule";
import CloudySky from "./Components/Cloud";
import HulkSchedule from "./Components/HulkSchedule";
import LOTRSchedule from "./Components/LOTRSchedule";
import FootballSchedule from "./Components/FootballSchedule";

 
 function App() {
  return (
    <>
    <FootballSchedule day="Sunday" />
   </>
  );
}

export default App;


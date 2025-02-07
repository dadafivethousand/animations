import React from "react";
import './Stylesheets/App.css'
import SimpsonsSchedule from "./Components/SimpsonsSchedule";
import CloudySky from "./Components/Cloud";
import HulkSchedule from "./Components/HulkSchedule";
import LOTRSchedule from "./Components/LOTRSchedule";

 
 function App() {
  return (
    <>
    <LOTRSchedule day="Sunday" />
   </>
  );
}

export default App;


import React from "react";
import './Stylesheets/App.css'
import SimpsonsSchedule from "./Components/SimpsonsSchedule";
import CloudySky from "./Components/Cloud";
import KhabibSchedule from "./Components/KhabibSchedule";
 
 function App() {
  return (
    <>
    <KhabibSchedule day="Friday" />
   </>
  );
}

export default App;


import React from "react";
import "./Stylesheets/App.css"
import AirForceOnesSchedule from "./Components/AirForceOnesSchedule";
 
 

function App() {
  return (
    <>
       <AirForceOnesSchedule day="Monday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
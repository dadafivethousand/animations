import React from "react";
import "./Stylesheets/App.css"
 
import WarcraftSchedule from "./Used/WarcraftSchedule";

function App() {
  return (
    <>
       <WarcraftSchedule day="Thursday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

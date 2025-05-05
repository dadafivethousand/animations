import React from "react";
import './Stylesheets/App.css';

 
import FerrariSchedule from "./Components/FerrariSchedule";
 

function App() {
  return (
    <>
      <FerrariSchedule day="Monday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

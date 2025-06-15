import React from "react";
import "./Stylesheets/App.css"
 
 
import Six9ineSchedule from "./Components/SixNineSchedule";


function App() {
  return (
    <>
       < Six9ineSchedule day="Monday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

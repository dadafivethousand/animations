import React from "react";
import "./Stylesheets/App.css"
 
 

 
 
import LegoSchedule from "./Components/LegoSchedule";
import TTCSchedule from "./Components/TTCSchedule";
import GOSchedule from "./Components/GOSchedule";
import CharlieSchedule from "./Used/CharlieSchedule";
import AmazonSchedule from "./Components/AmazonSchedule";
import SouthParkSchedule from "./Used/SouthParkSchedule"
function App() {
  return (
    <>
  < SouthParkSchedule day={"Tuesday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;


 
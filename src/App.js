import React from "react";
import "./Stylesheets/App.css"
 
 

 
 
import LegoSchedule from "./Components/LegoSchedule";
import TTCSchedule from "./Components/TTCSchedule";
import GOSchedule from "./Components/GOSchedule";
import CharlieSchedule from "./Used/CharlieSchedule";
import AmazonSchedule from "./Components/AmazonSchedule";
import SouthParkSchedule from "./Used/SouthParkSchedule"
import ADCCSchedule from "./Used/ADCCSchedule";
import WuTangSchedule from "./Used/WuTangSchedule";
function App() {
  return (
    <>
  < WuTangSchedule day={"Thursday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;


 
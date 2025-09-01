import React from "react";
import "./Stylesheets/App.css"
 
 

 
 
import LegoSchedule from "./Components/LegoSchedule";
import TTCSchedule from "./Components/TTCSchedule";
import GOSchedule from "./Components/GOSchedule";
import CharlieSchedule from "./Used/CharlieSchedule";
import AmazonSchedule from "./Components/AmazonSchedule";
 
function App() {
  return (
    <>
  < AmazonSchedule day={"Monday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;


 
import React from "react";
import "./Stylesheets/App.css"
 
 
import AsapRockySchedule from "./Used/ASAPRockySchedule"
function App() {
  return (
    <>
  <AsapRockySchedule day={"Friday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
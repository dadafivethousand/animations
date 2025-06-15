import React from "react";
import "./Stylesheets/App.css"
 
import MapleJiuJitsuHeader from "./Components/MapleJiuJitsuHeader";
import ASAPRockySchedule from "./Components/ASAPRockySchedule";
 


function App() {
  return (
    <>
       <ASAPRockySchedule day="Wednesday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

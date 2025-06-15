import React from "react";
import "./Stylesheets/App.css"
 
import RolexSchedule from "./Used/Lit/RolexSchedule";
import GodfatherSchedule from "./Used/Lit/GodfatherSchedule";
import DJKhaledSchedule from "./Components/DJKhaledSchedule";
import HitEmUpSchedule from "./Components/HitEmUpSchedule";

function App() {
  return (
    <>
       <HitEmUpSchedule day="Monday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

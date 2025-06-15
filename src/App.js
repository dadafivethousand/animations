import React from "react";
import "./Stylesheets/App.css"
 
import RolexSchedule from "./Used/Lit/RolexSchedule";
import GodfatherSchedule from "./Used/Lit/GodfatherSchedule";

function App() {
  return (
    <>
       <GodfatherSchedule day="Wednesday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

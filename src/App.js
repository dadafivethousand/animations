import React from "react";
import "./Stylesheets/App.css"
import GatoradeSchedule from "./Components/GatoradeSchedule";
import VenomSchedule from "./Used/VenomSchedule"
 


function App() {
  return (
    <>
       <VenomSchedule day="Tuesday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

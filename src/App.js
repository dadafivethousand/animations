import React from "react";
import "./Stylesheets/App.css"

import PeakyBlindersSchedule from "./Components/PeakyBlindersSchedule";
import JohnWickSchedule from "./Components/JohnWickSchedule";
import TomJerrySchedule from "./Components/TomJerrySchedule";
import OldSpiceSchedule from "./Components/OldSpiceSchedule";
import KeyPeeleSchedule from "./Components/KeyPeeleSchedule";
import Fox20thSchedule from "./Components/Fox20thSchedule";
  function App() {
  return (
    <>
  <Fox20thSchedule day="Tuesday" />
       {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;


 
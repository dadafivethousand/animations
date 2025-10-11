import React from "react";
import "./Stylesheets/App.css"

import PeakyBlindersSchedule from "./Components/PeakyBlindersSchedule";
  function App() {
  return (
    <>
  <PeakyBlindersSchedule day="Monday" />
       {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;


 
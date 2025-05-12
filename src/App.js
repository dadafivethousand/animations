import React from "react";
import './Stylesheets/App.css';
 
import InuyashaSchedule from "./Components/InuyashaSchedule"
import DonkeyKongSchedule from "./Components/DonkeyKongSchedule";
import BoxSchedule from "./Components/BoxSchedule";

  

function App() {
  return (
    <>
      < BoxSchedule day="Wednesday" />

      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

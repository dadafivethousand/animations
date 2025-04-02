import React from "react";
import './Stylesheets/App.css'
 
 
import SamuraiSchedule from "./Components/SamuraiSchedule"
import BondBarrel from "./Components/BondBarrel";
import SpinWheel from "./Components/SpinWheel";
import TiestoSchedule from "./Components/TiestoSchedule";
import GothicSchedule from "./Components/GothicSchedule";
 
  
 function App() {
  return (
    <>
    <GothicSchedule day="Friday"/>
   </>
  );
}

export default App;


import React from "react";
import "./Stylesheets/App.css"

import PeakyBlindersSchedule from "./Components/PeakyBlindersSchedule";
import JohnWickSchedule from "./Components/JohnWickSchedule";
import TomJerrySchedule from "./Components/TomJerrySchedule";
import OldSpiceSchedule from "./Components/OldSpiceSchedule";
import KeyPeeleSchedule from "./Components/KeyPeeleSchedule";
import MGMGrandSchedule from "./Components/MGMGrandSchedule";
import CasperSchedule from "./Components/CasperSchedule";
import SmurfSchedule from "./Components/SmurfSchedule";
import ElmoSchedule from "./Components/ElmoSchedule";
import BrickSchedule from "./Components/BrickSchedule"
import RoosterSchedule from "./Components/RoosterSchedule";
import BlacksmithSchedule from "./Components/BlacksmithSchedule";
import StarcraftSchedule from "./Components/StarcraftSchedule";
import TikTokSchedule from "./Components/TikTokSchedule";
import NarutoSchedule from "./Components/NarutoSchedule";
import OnePieceSchedule from "./Components/OnePieceSchedule";
   function App() {
  return (
    <>
  <MGMGrandSchedule day="Tuesday" />
       {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;


 
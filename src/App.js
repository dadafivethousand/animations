import React from "react";
import "./Stylesheets/App.css"
 
 
import BrockSchedule from "./Components/BrockSchedule";
import TrueReligionSchedule from "./Components/TrueReligionSchedule";
import SafariSchedule from "./Components/SafariSchedule";
import ADCCSchedule from "./Components/ADCCSchedule";
import MonstersIncSchedule from "./Components/MonstersIncSchedule"
import TransformersSchedule from "./Used/TransformersSchedule";
import VegasSchedule from "./Used/VegasSchedule";
import StreetFighterSchedule from "./Used/StreetFighterSchedule";
 import KarateKidSchedule from "./Components/KarateKidSchedule";
import TourDeFranceSchedule from "./Components/TourDeFranceSchedule";
import FoxNewsSchedule from "./Used/FoxNewsSchedule";
import GodzillaSchedule from "./Used/GodzillaSchedule";
import SpartanSchedule from "./Used/SpartanSchedule";
import SonicSchedule from "./Used/SonicSchedule";
import BadBoysSchedule from "./Used/BadBoysSchedule";
function App() {
  return (
    <>
  < BadBoysSchedule day={"Friday"}/>
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;
 
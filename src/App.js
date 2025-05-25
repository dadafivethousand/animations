import React from "react";
import './Stylesheets/App.css';
 
import InuyashaSchedule from "./Components/InuyashaSchedule"
import DonkeyKongSchedule from "./Components/DonkeyKongSchedule";
import BoxSchedule from "./Components/BoxSchedule";
import DiorSchedule from "./Components/DiorSchedule";
import Spray from "./Components/Spray";
import SpotifySchedule from "./Components/SpotifySchedule";
import WolfSchedule from "./Components/WolfSchedule";
import ScarfaceSchedule from "./Components/ScarfaceSchedule";
import RedditSchedule from "./Components/RedditSchedule";
import RickAndMortySchedule from "./Components/RickAndMortySchedule";
import PollosSchedule from "./Components/PollosSchedule";
import GigaChadSchedule from "./Components/GigaChadSchedule";
import FridaySchedule from "./Components/FridaySchedule";
 import RealisticFolder from "./Components/RealisticFolder";
import FBIFolderSchedule from "./Components/FBISchedule";
import MafiaSchedule from "./Components/MafiaSchedule";
import CodeSchedule from "./Components/CodeSchedule";
 
  

function App() {
  return (
    <>
      < CodeSchedule day="Monday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

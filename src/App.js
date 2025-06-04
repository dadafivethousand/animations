import React from "react";
import './Stylesheets/App.css';
 import JoeRoganSchedule from"./Components/JoeRoganSchedule"
 
import Poster from "./Components/Poster"
import AvatarSchedule from "./Components/AvatarSchedule";
import AITerminalSchedule from "./Components/AITerminalSchedule"
  

function App() {
  return (
    <>
      < AITerminalSchedule day="Thursday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

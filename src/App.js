import React from "react";
import './Stylesheets/App.css';
 import JoeRoganSchedule from"./Components/JoeRoganSchedule"
 
import Poster from "./Components/Poster"
  
  

function App() {
  return (
    <>
      < JoeRoganSchedule day="Monday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

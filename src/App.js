import React from "react";
import "./Stylesheets/App.css"
import GatoradeSchedule from "./Components/GatoradeSchedule";
 
 


function App() {
  return (
    <>
       < GatoradeSchedule day="Tuesday" />
      {/* You can toggle others like this */}
      {/* <GladiatorSchedule day="Sunday" /> */}
    </>
  );
}

export default App;

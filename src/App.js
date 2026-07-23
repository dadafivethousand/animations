import React from "react";
import "./Stylesheets/App.css";

// Reviewing the Robotics scene standalone; swap back to CodeNinjasReel to run the reel.
import SceneRobotics from "./Components/SceneRobotics";
// import CodeNinjasReel from "./Components/CodeNinjasReel";

function App() {
  return <div style={{ position: "fixed", inset: 0, background: "#000" }}><SceneRobotics /></div>;
}

export default App;

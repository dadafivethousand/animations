import React from "react";
import "./Stylesheets/App.css";

// Reviewing the Chess scene standalone; swap back to CodeNinjasReel to run the reel.
import SceneChess from "./Components/SceneChess";
// import CodeNinjasReel from "./Components/CodeNinjasReel";

function App() {
  return <div style={{ position: "fixed", inset: 0, background: "#000" }}><SceneChess /></div>;
}

export default App;

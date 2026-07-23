import React from "react";
import "./Stylesheets/App.css";

// Reviewing the AI scene standalone; swap back to CodeNinjasReel to run the reel.
import SceneAI from "./Components/SceneAI";
// import CodeNinjasReel from "./Components/CodeNinjasReel";

function App() {
  return <div style={{ position: "fixed", inset: 0, background: "#000" }}><SceneAI /></div>;
}

export default App;

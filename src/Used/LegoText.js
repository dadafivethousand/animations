import React from "react";
import "../Stylesheets/LegoText.css";

function LegoText({ word = "LEGO" }) {
  return (
    <div className="lego-container">
      <span className="lego-text">{word.toUpperCase()}</span>
    </div>
  );
}

export default LegoText;

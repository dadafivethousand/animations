import React from "react";
import "../Stylesheets/PunchingBag.css";

const PunchingBag = () => {
  return (
    <div className="punching-bag">
      <div className="bag-chain">
        <div className="chain-link"></div>
        <div className="chain-link"></div>
        <div className="chain-link"></div>
      </div>
      <div className="bag-body"></div>
    </div>
  );
};

export default PunchingBag;

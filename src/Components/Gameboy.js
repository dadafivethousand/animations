import React from "react";
import "../Stylesheets/Gameboy.css";

export default function GameBoy() {
  return (
    <div className="gameboy-body">
      <div className="power-switch">OFF • ON</div>
      <div className="gameboy-screen">
        <div className="screen-border">
            <div className="battery-light-and-label">
          <div className="battery-light"></div>
          <div className="battery-label">BATTERY</div>
          </div>
          <div className="dot-matrix">DOT MATRIX WITH STEREO SOUND</div>
          <div className="screen-inner"></div>
        </div>
      </div>
      <div className="logo">Nintendo <span>GAME BOY™</span></div>

      <div className="controls">
        <div className="dpad">
          <div className="dpad-vertical"></div>
          <div className="dpad-horizontal"></div>
        </div>
        <div className="buttons">
          <button className="button a-button"> <span>A</span> </button>
          <button className="button b-button"> <span>A</span></button>
        </div>
      </div>

      <div className="start-select">
        <button className="flat-button">SELECT</button>
        <button className="flat-button">START</button>
      </div>

      <div className="speaker">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="speaker-line" key={i}></div>
        ))}
      </div>

      <div className="headphone-jack">📶PHONES</div>
    </div>
  );
}

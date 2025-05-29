import React from "react";
import "../Stylesheets/Poster.css";
import max_image from "../Images/OTO09135 (1).jpg";

export default function Poster() {
  return (
    <div className="poster-container">
      <img src={max_image} alt="Max Li Seminar" className="poster-image" />
      <div className="poster-text">
        <div>
        <h1 className="poster-title">Brazilian Jiu-Jitsu Seminar</h1>
        <div className="poster-datetime">
  <p><strong>Date:</strong> May 12</p>
  <p><strong>Time:</strong> 7:45 PM</p>
</div>
        </div>
        <div className="name-and-accomplishments">
        <h2 className="poster-name">Max Li</h2>
        <ul className="poster-accomplishments">
          <li>Brazilian Jiu-Jitsu Black Belt</li>
          <li>Professional MMA Experience</li>
          <li> ADCC Toronto Open Champion </li>
          <li> IBJJF Milan Open Champion</li>
          <li> IBJJF Charlotte Open Champion</li>
          <li> Canadian National Champion</li>
          <li> IBJJF American Nationals Bronze Medalist</li>
          <li> Ontario Open Champion</li>
        </ul>
        </div>
      </div>
    </div>
  );
}

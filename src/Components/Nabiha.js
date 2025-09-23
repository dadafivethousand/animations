import React from "react";
import "../Stylesheets/Nabiha.css";
import nabihaImg from "../Images/Nabiha.JPG";
import nabihaImg2 from "../Images/Nabiha2.jpg";

export default function Nabiha() {
  return (
    <div className="nb-page">
      {/* Photos */}
      <div className="nb-photo-stack">
        <div className="nb-polaroid back">
          <img src={nabihaImg2} alt="Nabiha alt" />
        </div>
        <div className="nb-polaroid front">
          <img src={nabihaImg} alt="Nabiha Shaikh" />
          {/* Sticky overlaps the photo */}
          <div className="nb-sticky-real">
            <span className="nb-sticky-text">Free for All Women</span>
          </div>
        </div>
      </div>

      {/* Writing */}
      <div className="nb-writing">
        <h1 className="nb-title">Women’s BJJ Seminar</h1>
        <p className="nb-big"><b>Instructor:</b> Nabiha Shaikh</p>
        <p className="nb-big"><b>Date:</b> October 24, 7:30 PM</p>
        <p className="nb-big"><b>Location:</b> Maple BJJ</p>
        <p className="nb-small">20 Cranston Park, Maple, Ontario</p>
        <p className="nb-cta">NO EXPERIENCE REQUIRED</p>
      </div>

      {/* Doodles */}
      <div className="nb-doodle star">*</div>
      <div className="nb-doodle heart">❤</div>
      <div className="nb-doodle arrow">➜</div>
    </div>
  );
}

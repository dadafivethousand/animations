import React, { useEffect, useState } from "react";
import "../Stylesheets/Nabiha.css";
import nabihaImg from "../Images/Nabiha.JPG";
import nabihaImg2 from "../Images/Nabiha2.jpg";

export default function Nabiha() {
  const [inBack, setInBack] = useState(false);
  const [inFront, setInFront] = useState(false);
  const [inSticky, setInSticky] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) { setInBack(true); setInFront(true); setInSticky(true); return; }

    setInBack(true);                               // 0s  → back slides in
    const t1 = setTimeout(() => setInFront(true), 1000);  // +1s → front slides in
    const t2 = setTimeout(() => setInSticky(true), 2000); // +1s → sticky slides/pastes in
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="nb-page">
      {/* Photos */}
      <div className="nb-photo-stack">
        <div className={`nb-polaroid back ${inBack ? "is-in" : ""}`}>
          <img src={nabihaImg2} alt="Nabiha alt" />
        </div>
        <div className={`nb-polaroid front ${inFront ? "is-in" : ""}`}>
          <img src={nabihaImg} alt="Nabiha Shaikh" />
        </div>

        {/* Sticky overlaps the bottom-right of the stack, animates independently */}
        <div className={`nb-sticky-real ${inSticky ? "is-in" : ""}`}>
          <span className="nb-sticky-text">Free for All Women</span>
        </div>
      </div>

      {/* Writing */}
      <div className="nb-writing">
        <h1 className="nb-title">Women’s BJJ Seminar</h1>
        <p className="nb-big"><b>Instructor:</b> Nabiha Shaikh</p>
        <p className="nb-big"><b>Date:</b> October 24, 7:30 PM</p>
        <p className="nb-big"><b>Location:</b> Maple BJJ</p>
        <p className="nb-small">20 Cranston Park, Maple, Ontario</p>
        <p className="nb-cta">NO EXPERIENCE REQUIRED!</p>
      </div>
    </div>
  );
}

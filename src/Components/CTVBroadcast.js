// CTVBroadcast.jsx
// Mobile-first CTV-style breaking news announcement
// Includes: headline banner, ticker, image placeholder
// Import related CSS file: CTVBroadcast.css

import React from "react";
import "../Stylesheets/CTVBroadcast.css";

export default function CTVBroadcast() {
  return (
    <div className="ctv-container">
      {/* TOP HEADER */}
      <div className="ctv-header">BREAKING NEWS</div>

      {/* IMAGE PLACEHOLDER */}
      <div className="ctv-image-placeholder">
        {/* Replace <div> with <img src="..." /> when ready */}
        <span>IMAGE / VIDEO HERE</span>
      </div>

      {/* MAIN CONTENT */}
      <div className="ctv-content">
        <h1 className="ctv-title">Women’s BJJ Class – This Saturday</h1>
        <p className="ctv-subtitle">
          December 20, 2025 · Led by <strong>Nabiha Shaikh</strong>
        </p>
      </div>

      {/* TICKER */}
      <div className="ctv-ticker-wrapper">
        <div className="ctv-ticker">
          WOMEN'S BJJ CLASS — SATURDAY DECEMBER 20 — LED BY NABIHA SHAIKH — MAPLE JIU-JITSU — DON'T MISS IT —
          WOMEN'S BJJ CLASS — SATURDAY DECEMBER 20 — LED BY NABIHA SHAIKH — MAPLE JIU-JITSU — DON'T MISS IT —
        </div>
      </div>
    </div>
  );
}

// CTVBroadcast.jsx
// Ultra-realistic CTV-style mobile broadcast for Women's BJJ announcement

import React from "react";
import "../Stylesheets/CTVBroadcast.css";
import ctvlogo from "../Images/ctvlogo.png"
import womensclass from "../Images/IMG_4224.jpg"

export default function CTVBroadcast() {
  const tickerText =
    "WOMEN'S BJJ CLASS • SATURDAY DECEMBER 20, 2025 • 12:00 PM • LED BY NABIHA SHAIKH & JESSICA CHABERSKI • MAPLE JIU-JITSU • WOMEN ONLY • ALL LEVELS WELCOME • LIMITED SPOTS • DM @NABIHA.SHAIKH ON INSTAGRAM TO REGISTER • ";

  return (
    <div className="ctv-root">
      <div className="ctv-frame">
        {/* TOP INFO BAR (EVENT FOCUS) */}
        <div className="ctv-info-bar">
          <div className="ctv-info-left">
            <span className="ctv-info-label">SAT</span>
            <span className="ctv-info-date">DEC 20, 2025</span>
          </div>
          <div className="ctv-info-center">
            MAPLE, ON • WOMEN&apos;S BJJ EVENT
          </div>
          <div className="ctv-info-right">
            <span className="ctv-info-time">12:00 PM</span>
          </div>
        </div>

        {/* MAIN TOP BAR: CTV LOGO + LIVE + BUG */}
        <header className="ctv-topbar">
          <div className="ctv-logo">
 <img className="ctvlogo" src={ctvlogo} />
        <span className="ctv-logo-text">NEWS</span>
          </div>

          <div className="ctv-live-group">
            <div className="ctv-live-pill">
              <span className="ctv-live-dot" />
              LIVE
            </div>
            <div className="ctv-network-bug">
              MAPLE JIU-JITSU
            </div>
          </div>
        </header>

        {/* HEADLINE STRAP */}
        <div className="ctv-headline-banner">
          <div className="ctv-headline-left">SPECIAL REPORT</div>
          <div className="ctv-headline-right">
            WOMEN&apos;S BRAZILIAN JIU-JITSU CLASS ANNOUNCED FOR DEC 20
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="ctv-main">
          {/* VIDEO / IMAGE ZONE WITH LOWER THIRD OVERLAY */}
          <div className="ctv-video-area">
            <div className="ctv-image-shell">
              {/* Replace this div with an <img> when you have real media */}
              <div className="ctv-image-placeholder">
              <img className="womens-class" src={womensclass} />
              </div>
            </div>

            {/* LOWER THIRD OVERLAY */}
            <div className="ctv-lower-third">
              <div className="ctv-lower-main">
                <div className="ctv-lower-line-primary">
                  WOMEN&apos;S BJJ CLASS – MAPLE JIU-JITSU
                </div>
                <div className="ctv-lower-line-secondary">
                  SAT DEC 20, 2025 • 12:00 PM  
                </div>
              </div>
              <div className="ctv-lower-side">
                <div className="ctv-lower-side-top">LOCAL SPORTS</div>
                <div className="ctv-lower-side-bottom">BJJ • COMMUNITY</div>
              </div>
            </div>
          </div>

          {/* STORY TEXT BELOW VIDEO */}
          <section className="ctv-story">
            <h1 className="ctv-story-title">
              Women&apos;s Brazilian Jiu-Jitsu Class
            </h1>

            <p className="ctv-story-meta">
              <span className="ctv-label">Event Date:</span> Saturday,
              December 20, 2025
            </p>
            <p className="ctv-story-meta">
              <span className="ctv-label">Time:</span> 12:00 PM (Noon)
            </p>
            <p className="ctv-story-meta">
              <span className="ctv-label">Instructors:</span> Nabiha Shaikh & Jessica Chaberski
            </p>
    
            <p className="ctv-story-copy">
              Spots are limited. To secure your place, send a direct message to{" "}
              <strong>@nabiha.shaikh</strong> on Instagram and reserve your spot.
            </p>
          </section>
        </main>

        {/* BOTTOM TICKER FILM STRIP */}
        <div className="ctv-ticker-shell">
          <div className="ctv-ticker-label">MAPLE ALERT</div>
          <div className="ctv-ticker-mask">
            <div className="ctv-ticker-track">
              <span>{tickerText}</span>
              <span>{tickerText}</span>
              <span>{tickerText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

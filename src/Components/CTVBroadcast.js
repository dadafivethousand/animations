// CTVBroadcast.jsx
// Ultra-realistic CTV-style mobile broadcast for Women's BJJ announcement

import React from "react";
import "../Stylesheets/CTVBroadcast.css";
import classImage from "../Images/IMG_4224.jpg"

export default function CTVBroadcast() {
  const tickerText =
    "WOMEN'S BJJ CLASS • SATURDAY DECEMBER 20, 2025 • 1:00 PM • LED BY NABIHA SHAIKH • MAPLE JIU-JITSU • WOMEN ONLY • ALL LEVELS WELCOME • LIMITED SPOTS • DM @MAPLE_JIU_JITSU TO REGISTER • ";

  return (
    <div className="ctv-root">
      <div className="ctv-frame">
        {/* TOP INFO BAR */}
        <div className="ctv-info-bar">
          <div className="ctv-info-left">
            <span className="ctv-info-label">SAT</span>
            <span className="ctv-info-date">DEC 20, 2025</span>
          </div>
          <div className="ctv-info-center">
            MAPLE, ON • WOMEN&apos;S BJJ
          </div>
          <div className="ctv-info-right">
            <span className="ctv-info-time">12:00 PM</span>
          </div>
        </div>

        {/* MAIN TOP BAR: LOGO + LIVE */}
        <header className="ctv-topbar">
          <div className="ctv-logo">
            <span className="ctv-logo-block ctv-logo-block--red">C</span>
            <span className="ctv-logo-block ctv-logo-block--blue">T</span>
            <span className="ctv-logo-block ctv-logo-block--green">V</span>
            <span className="ctv-logo-text">NEWS</span>
          </div>

          <div className="ctv-live-group">
            <div className="ctv-live-pill">
              <span className="ctv-live-dot" />
              LIVE
            </div>
            <div className="ctv-network-bug">MAPLE JIU-JITSU</div>
          </div>
        </header>

        {/* HEADLINE STRAP */}
        <div className="ctv-headline-banner">
          <div className="ctv-headline-left">SPECIAL REPORT</div>
          <div className="ctv-headline-right">
            WOMEN&apos;S BRAZILIAN JIU-JITSU CLASS THIS SATURDAY
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="ctv-main">
          {/* IMAGE + LOWER THIRD OVERLAY ZONE */}
          <div className="ctv-video-area">
            <div className="ctv-image-shell">
              {/* Replace this inner div with an <img> when you have real media */}
              <div className="ctv-image-placeholder"> 
                <img className="class-image" src={classImage}/>
               </div>
            </div>

            {/* LOWER THIRD OVERLAY (like TV) */}
            <div className="ctv-lower-third">
              <div className="ctv-lower-main">
                <div className="ctv-lower-line-primary">
                  WOMEN&apos;S BJJ CLASS – MAPLE JIU-JITSU
                </div>
                <div className="ctv-lower-line-secondary">
                  SATURDAY DECEMBER 20, 2025 • LED BY NABIHA SHAIKH
                </div>
              </div>
              <div className="ctv-lower-side">
                <div className="ctv-lower-side-top">LOCAL SPORTS</div>
                <div className="ctv-lower-side-bottom">BJJ • COMMUNITY</div>
              </div>
            </div>
          </div>

          {/* STORY COPY BELOW VIDEO */}
          <section className="ctv-story">
            <h1 className="ctv-story-title">
              Women&apos;s Brazilian Jiu-Jitsu – Special Class
            </h1>
            <p className="ctv-story-meta">
              <span className="ctv-label">Date:</span> Saturday, December 20,
              2025
            </p>
            <p className="ctv-story-meta">
              <span className="ctv-label">Time:</span> 12:00 PM
            </p>
            <p className="ctv-story-meta">
              <span className="ctv-label">Instructor:</span> Nabiha Shaikh
            </p>
            <p className="ctv-story-copy">
              A dedicated women&apos;s-only Brazilian Jiu-Jitsu session at Maple
              Jiu-Jitsu. Focus on fundamentals, self-confidence, and safe
              rolling in a supportive environment. Open to all experience
              levels—no prior training required.
            </p>
            <p className="ctv-story-copy">
              Spots are limited. DM{" "}
              <strong>@maple_bjj</strong> to secure your place on the
              mats for this special event.
            </p>
          </section>
        </main>

        {/* BOTTOM NEWS TICKER / FILM STRIP */}
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

// SceneWebDev.jsx — reel scene: "WEB DEV".
// A browser window builds a webpage: the hero banner, nav, cards and a button
// assemble in, a cursor clicks Publish, and a "Published" toast pops. Clean
// blue web palette on a dark stage.
import React from "react";
import "../Stylesheets/CodeNinjasReel.css";

const CARDS = ["a", "b", "c", "d"];

export default function SceneWebDev() {
  return (
    <div className="sc sc-web">
      <div className="web-amb" aria-hidden />

      <div className="sc-head">
        <span className="sc-num">05</span>
        <span className="sc-title">WEB DEV</span>
        <span className="sc-rule" />
        <span className="sc-desc">Kids build websites.</span>
      </div>

      <div className="web-stage">
        <div className="web-browser">
          <div className="web-bar">
            <i /><i /><i />
            <span className="web-url">🔒 cnwoodbridge.com</span>
          </div>

          <div className="web-page">
            <div className="web-hero">
              <span className="web-logo" />
              <span className="web-h1" />
              <span className="web-h2" />
            </div>

            <div className="web-nav"><span /><span /><span /><span /></div>

            <div className="web-cards">
              {CARDS.map((c, i) => (
                <div key={c} className={`web-card web-card--${c}`} style={{ animationDelay: `${1.2 + i * 0.12}s` }}>
                  <span /><b />
                </div>
              ))}
            </div>

            <div className="web-lines"><span /><span /><span /></div>

            <button className="web-btn">Publish</button>
          </div>

          <span className="web-cursor" aria-hidden>
            <svg viewBox="0 0 24 24"><path d="M4 2l7 18 2.5-7.5L21 10z" /></svg>
          </span>
        </div>

        <div className="web-toast" aria-hidden><b>✓</b> Published</div>
      </div>
    </div>
  );
}

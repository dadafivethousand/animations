// MapleBeltJourney.jsx — Maple Jiu-Jitsu belt-journey clip.
// Same belt-journey design, branded for Maple Jiu-Jitsu.
import React from "react";
import BjjBeltJourney from "./BjjBeltJourney";
import mapleLogo from "../Images/maple-bjj-logo.png";

export default function MapleBeltJourney() {
  return (
    <BjjBeltJourney
      academy="Maple Jiu-Jitsu"
      logo={mapleLogo}
      contact="20 Cranston Park Ave  ·  maplebjj.com  ·  (647) 887-9940"
    />
  );
}

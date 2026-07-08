// RichmondHillBeltJourney.jsx — Richmond Hill Jiu-Jitsu belt-journey clip.
import React from "react";
import BjjBeltJourney from "./BjjBeltJourney";
import rhLogo from "../Images/rh-bjj-logo.png";

export default function RichmondHillBeltJourney() {
  return (
    <BjjBeltJourney
      academy="RICHMOND HILL JIU-JITSU"
      logo={rhLogo}
      lightTop
      address="132 King Road"
      website="rhbjj.ca"
      phone="(416) 992-1169"
    />
  );
}

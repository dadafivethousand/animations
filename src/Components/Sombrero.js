import React from "react";
import "../Stylesheets/Sombrero.css";

const Sombrero = () => {
  return (
    <div className="sombrero-container">
      {/* Wide Brim */}
      <div className="sombrero-brim">
        <div className="sombrero-trim"></div>
      </div>

      {/* Tall Crown */}
      <div className="sombrero-crown"></div>

      {/* Pom-Poms hanging from the brim */}
      <div className="sombrero-pom-poms">
        <div className="sombrero-pom-pom"></div>
        <div className="sombrero-pom-pom"></div>
        <div className="sombrero-pom-pom"></div>
        <div className="sombrero-pom-pom"></div>
        <div className="sombrero-pom-pom"></div>
      </div>

      {/* Mexican Flag Decoration */}
      <div className="sombrero-flag"></div>
    </div>
  );
};

export default Sombrero;

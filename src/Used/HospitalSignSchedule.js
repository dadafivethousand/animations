import React, { useEffect, useState } from "react";
import "./HospitalSignSchedule.css";
import schedule from "../RhSchedule";

 
const HospitalSignsSchedule = () => {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    schedule.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, index]);
      }, index * 300); // Staggered effect, each item appears 300ms after the last one
    });
  }, []);

  return (
    <div className="hospital-signs-outer-container">
      <div className="hospital-signs-container">
        {schedule.map((item, index) => (
          <div
            key={index}
            className={`hospital-sign ${item.header ? "big" : ""} ${
              visibleItems.includes(index) ? "slide-in" : ""
            }`}
          >
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalSignsSchedule;

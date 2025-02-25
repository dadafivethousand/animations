import React, { useEffect, useState } from "react";
import "../Stylesheets/HospitalSignSchedule.css";

const schedule = [
  { text: "MONDAY", header: true },
  { text: "7:30 - BJJ NoGi" },
  { text: "" },
  { text: "12:30 - BJJ NoGi" },
  { text: " " },
  { text: "5:15 - MMA" },
  { text: "6:15 - Wrestling" },
  { text: "7:15 - BJJ NoGi" },
];

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

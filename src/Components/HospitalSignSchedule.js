import React from "react";
import "../Stylesheets/HospitalSignSchedule.css";

const schedule = [
  { text: "MONDAY" , header: true, },
  { text: "7:30 - BJJ NoGi" },
  { text: ""  },
  { text: "12:30 - BJJ NoGi" },
  { text: " " },
  { text: "5:15 - MMA"  },
  { text: "6:15 - Wrestling" },
  { text: "7:15 - BJJ NoGi" },
];

const HospitalSignsSchedule = () => {
  return (
    <div className="hospital-signs-outer-container">
        
    <div className="hospital-signs-container">
      {schedule.map((item, index) => (
        <div key={index} className={`hospital-sign ${item.header? 'big': ''}`}>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
    </div>
  );
};

export default HospitalSignsSchedule;

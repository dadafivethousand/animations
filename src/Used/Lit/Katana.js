import React from 'react';
import './Katana.css';

const Katana = () => {
  return (
    <div className="katana-vertical">
      <div className="katana-blade">
        <div className="blade-reflection" />
      </div>
      <div className="katana-guard" />
      <div className="katana-handle">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="handle-wrap" />
        ))}
      </div>
    </div>
  );
};

export default Katana;

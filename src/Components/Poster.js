import React from 'react';
import '../Stylesheets/Poster.css';
import matspace from "../Images/20250604_175603.jpg";
import nobackgroundlogo from "../Images/png/logo-no-background.png";
import Typewriter from '../Utils/utils';

export default function Poster() {
  return (
    <div className='poster-container'>
      <div className="typewriter-wrapper">
        <div className="announcement">
          <Typewriter text="Announcement" delay='1200' />
        </div>
        <div className="details">
          <Typewriter
            delay='2500'
            text="The Saturday noon jiu-jitsu class will be held at Richmond Hill Jiu-Jitsu as part of the grand opening. Hope to see everyone there."
          />
        </div>
      </div>

      <img src={nobackgroundlogo} className="no-background-logo" alt="Logo" />
    </div>
  );
}

import React from 'react';
import '../Stylesheets/Poster.css';
import nobackgroundlogo from "../Images/png/logo-no-background.png";
import Typewriter from '../Utils/utils';

export default function Poster() {
  return (
    <div className='poster-container'>
      <div className='overlay'></div>

      <div className="typewriter-wrapper">
        <div className="announcement">
          <Typewriter text="Announcement!" delay='1200' />
        </div>
        <div className="details">
          <Typewriter
            delay='2500'
            typingSpeed = '80'
            text="This Saturday's 12:00 jiu-jitsu class will be held at the Richmond Hill location as part of the grand opening celebration. 132 King Road - pull up."
          />
        </div>
      </div>

      <img src={nobackgroundlogo} className="no-background-logo" alt="Logo" />
    </div>
  );
}

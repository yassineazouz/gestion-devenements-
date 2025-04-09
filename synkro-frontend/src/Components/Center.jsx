// src/Components/Center.jsx
import React from 'react';
import './css/Center.css';
import calendar from '../assets/calendar.png';

const Center = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>
            Collaborative <br />
            Event Management <br />
            Made Easy
          </h1>
          <p>
            Streamline planning and coordination with our intuitive platform. <br />
            Organize and manage events with your team efficiently.
          </p>
          <div className="hero-buttons">
            <button className="primary">Get Started</button>
            <button className="secondary">Watch Video</button>
          </div>
        </div>

        <div className="hero-image">
          <img src={calendar} alt="calendar" className="calendar-image" />
        </div>
      </div>
    </section>
  );
};

export default Center;

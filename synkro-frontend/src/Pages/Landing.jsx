import React from 'react';
import { Link } from 'react-router-dom';
import './css/Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo">Synkro</div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <Link to="/login" className="login-button">Log in</Link>
        </nav>
      </header>

      <main className="landing-main">
        <div className="text-content">
          <h1>Collaborative<br />Event Management<br />Made Easy</h1>
          <p>
            Streamline planning and coordination with our intuitive platform.<br />
            Organize and manage events with your team efficiently.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="get-started">Get Started</Link>
            <a href="#video" className="watch-video">Watch Video</a>
          </div>
        </div>

        <div className="illustration">
          <img src="https://i.postimg.cc/JhSybfd7/calendar-illustration.png" alt="Calendar illustration" />
        </div>
      </main>
    </div>
  );
};

export default Landing;
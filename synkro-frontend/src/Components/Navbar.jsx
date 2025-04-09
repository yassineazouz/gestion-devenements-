import React from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';
import logo from '../assets/logo_synkro.png'; 




const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Synkro Logo" className="logo" />
      </div>
      <ul className="navbar-center">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/features">Features</Link></li>
      <li><Link to="/pricing">Pricing</Link></li>
      <li><Link to="/contact">Contact</Link></li>
      </ul>
      <div className="navbar-right">
        <button className="login-btn">Log in</button>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useRef, useEffect } from 'react';
import './css/userMenu.css';

const UserMenu = ({ userName, onLogout, onAddEvent, onSettings }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="user-menu-container" ref={menuRef}>
      <div className="profile-photo" onClick={() => setOpen(!open)}>
        {userName.charAt(0).toUpperCase()}
      </div>

      {open && (
        <div className="dropdown">
          <p className="dropdown-header">Hi, {userName.split(' ')[0]}!</p>
          <hr />
          <button onClick={onAddEvent}>📅 Add Event</button>
          <button onClick={onSettings}>⚙️ Settings</button>
          <button onClick={() => alert('Feedback coming soon!')}>💬 Feedback</button>
          <hr />
          <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

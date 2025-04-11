import React, { useEffect, useRef } from 'react';
import './css/userMenu.css';

const UserMenu = ({ userName, onLogout, onAddEvent, onSettings, onProfile, onClose, onOpenNotifications, invitations = [] }) => {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="user-menu" ref={menuRef}>
      <div className="user-menu-header">
        <span className="user-name">{userName}</span>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <button onClick={onProfile}>Profil</button>
      <button onClick={onAddEvent}>Ajouter un événement</button>
      <button onClick={onSettings}>Paramètres</button>
      <button className="notif-btn" onClick={onOpenNotifications}>
        Notifications {invitations.length > 0 && <span className="notif-count">{invitations.length}</span>}
      </button>
      <button onClick={onLogout}>Déconnexion</button>
    </div>
  );
};

export default UserMenu;

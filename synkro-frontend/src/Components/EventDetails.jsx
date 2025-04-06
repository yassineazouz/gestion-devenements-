// EventDetails.jsx
import React, { useState } from 'react';
import './css/eventDetails.css';
import LocationSearch from './LocationSearch';

const EventDetails = ({ event, onClose, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({ ...event });

  const handleChange = (field, value) => {
    setEditedEvent({ ...editedEvent, [field]: value });
  };

  const handleRemove = (indexToRemove) => {
    const updated = [...editedEvent.invitees];
    updated.splice(indexToRemove, 1);
    setEditedEvent({ ...editedEvent, invitees: updated });
  };

  const handleSave = () => {
    onEdit(editedEvent);
    setEditing(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className='event-header-title'>Event Details</h2>
          <span className="close-btn" onClick={onClose}>×</span>
        </div>

        <input
          className="full-input"
          value={editedEvent.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          disabled={!editing}
        />

        <div className="row">
          <input
            className="full-input"
            placeholder="Nom"
            value={editedEvent.nom || ''}
            onChange={(e) => handleChange('nom', e.target.value)}
            disabled={!editing}
          />
          <input
            className="full-input"
            placeholder="Prenom"
            value={editedEvent.prenom || ''}
            onChange={(e) => handleChange('prenom', e.target.value)}
            disabled={!editing}
          />
        </div>

        <div className="row">
          <div className='column'>
            <textarea
              className="desc-input"
              placeholder="Desc"
              value={editedEvent.desc || ''}
              onChange={(e) => handleChange('desc', e.target.value)}
              disabled={!editing}
            />
            <div className="row">
              <input
                type="date"
                value={editedEvent.date || ''}
                className='number-input'
                onChange={e => handleChange('date', e.target.value)}
                disabled={!editing}
              />
              <input
                type="time"
                value={editedEvent.time || ''}
                className='number-input'
                onChange={e => handleChange('time', e.target.value)}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="invite-box">
            <div className="invite-header">
              <button className='invite-button' disabled={!editing}>+ Invite other people</button>
            </div>
            {(editedEvent.invitees || []).map((person, index) => (
              <div className="invitee" key={index}>
                <img className="dot-people-list" src={person.photo} alt={person.name} />
                <div className="person-info">
                  <div className="name">{person.name}</div>
                  <div className="email">{person.email}</div>
                  {editing && <span className="delete-btn" onClick={() => handleRemove(index)}>×</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="row">
          {editing ? (
            <LocationSearch location={editedEvent.location || ''} setLocation={(val) => handleChange('location', val)} />
          ) : (
            <input
              placeholder="Location"
              value={editedEvent.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled
              className="full-input"
            />
          )}
          <input
            placeholder="Link"
            value={editedEvent.link || ''}
            onChange={(e) => handleChange('link', e.target.value)}
            disabled={!editing}
          />
        </div>

        <div className="row">
          <select
            className='select-event event-type'
            value={editedEvent.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            disabled={!editing}
          >
            <option value="">Type of Meeting</option>
            <option value="Meeting">Meeting</option>
            <option value="Call">Call</option>
          </select>

          <div className="notification-row">
            <span className='notif-text'>Notification</span>
            <select
              className='select-event'
              value={editedEvent.notification?.type || 'Email'}
              onChange={e => handleChange('notification', { ...editedEvent.notification, type: e.target.value })}
              disabled={!editing}
            >
              <option value="Email">Email</option>
              <option value="Popup">Popup</option>
            </select>
            <input
              type="number"
              value={editedEvent.notification?.value || 30}
              onChange={e => handleChange('notification', { ...editedEvent.notification, value: e.target.value })}
              min={0}
              className="number-input"
              disabled={!editing}
            />
            <select
              className='select-event'
              value={editedEvent.notification?.unit || 'Minutes'}
              onChange={e => handleChange('notification', { ...editedEvent.notification, unit: e.target.value })}
              disabled={!editing}
            >
              <option value="Minutes">Minutes</option>
              <option value="Heures">Heures</option>
              <option value="Jours">Jours</option>
              <option value="Mois">Mois</option>
            </select>
          </div>
        </div>

        <div className="buttons">
          {!editing ? (
            <>
              <button className="cancel-btn" onClick={onClose}>Close</button>
              <button className="save-btn" onClick={() => setEditing(true)}>Edit</button>
            </>
          ) : (
            <>
              <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSave}>Save</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

import React, { useState } from 'react';
import './css/addEvent.css';
import people from './data.js';
import LocationSearch from './LocationSearch';
import InvitePeopleModal from './InvitePeopleModal';

import { createEvent } from '../services/event';

const AddEvent = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState('');
  const [notificationType, setNotificationType] = useState('Email');
  const [notificationValue, setNotificationValue] = useState(30);
  const [notificationUnit, setNotificationUnit] = useState('Minutes');
  const [peopleList, setPeopleList] = useState(people);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const userId = localStorage.getItem('userId');

  const handleInvite = (emails) => {
    const newPeople = emails.map(email => ({ name: 'Unknown', email, photo: 'default.png' }));
    setPeopleList(prev => [...prev, ...newPeople]);
  };

  const handleRemove = (indexToRemove) => {
    setPeopleList(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSave = async () => {
    const newEvent = {
      titre: title,
      description: desc,
      date,
      heure: time,
      lieu: location,
      organisateur: userId,
      coOrganisateurs: [],
    };

    try {
      await createEvent(newEvent);
      alert('Événement ajouté !');
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout de l'événement");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className='event-header-title'>Add Event</h2>
          <h2 className="close-btn" onClick={onClose}>×</h2>
        </div>
        <div className='event-form'>
          <input className="full-input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />

          <div className="row">
            <input className="full-input" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
            <input className="full-input" placeholder="Prenom" value={prenom} onChange={e => setPrenom(e.target.value)} />
          </div>

          <div className="row">
            <div className='column'>
              <textarea className="desc-input" placeholder="Desc" value={desc} onChange={e => setDesc(e.target.value)} />
              <div className="row">
                <input type="date" value={date} className='number-input' onChange={e => setDate(e.target.value)} />
                <input type="time" value={time} className='number-input' onChange={e => setTime(e.target.value)} />
              </div>
            </div>

            <div className="invite-box">
              <div className="invite-header">
                <button className='invite-button' onClick={() => setShowInviteModal(true)}>+ Invite other people</button>
              </div>
              {showInviteModal && (
                <InvitePeopleModal onClose={() => setShowInviteModal(false)} onInvite={handleInvite} />
              )}
              {peopleList.map((person, index) => (
                <div className="invitee" key={index}>
                  <img className="dot-people-list" src={person.photo} alt={person.name} />
                  <div className="person-info">
                    <div className="name">{person.name}</div>
                    <div className="email">{person.email}</div>
                    <span className="delete-btn" onClick={() => handleRemove(index)}>×</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row">
            <LocationSearch location={location} setLocation={setLocation} />
            <input placeholder="Link" value={link} onChange={e => setLink(e.target.value)} />
          </div>

          <div className="row">
            <select className='select-event event-type' value={type} onChange={e => setType(e.target.value)}>
              <option value="">Type of Meeting</option>
              <option value="Meeting">Meeting</option>
              <option value="Call">Call</option>
            </select>

            <div className="notification-row">
              <span className='notif-text'>Notification</span>
              <select className='select-event' value={notificationType} onChange={e => setNotificationType(e.target.value)}>
                <option value="Email">Email</option>
                <option value="Popup">Popup</option>
              </select>
              <input
                type="number"
                value={notificationValue}
                onChange={e => setNotificationValue(e.target.value)}
                min={0} className="number-input"
              />
              <select className='select-event' value={notificationUnit} onChange={e => setNotificationUnit(e.target.value)}>
                <option value="Minutes">Minutes</option>
                <option value="Heures">Heures</option>
                <option value="Jours">Jours</option>
                <option value="Mois">Mois</option>
              </select>
            </div>
          </div>
        </div>

        <div className="buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;

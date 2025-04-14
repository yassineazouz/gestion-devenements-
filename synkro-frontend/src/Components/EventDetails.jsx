// EventDetails.jsx
import React, { useState, useEffect } from 'react';
import './css/eventDetails.css';
import LocationSearch from './LocationSearch';
import InvitePeopleModal from './InvitePeopleModal';
import { updateEvent, deleteEvent, sendInvitation } from '../services/event';

const EventDetails = ({ event, onClose, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({
    title: event.titre || '',
    location: event.lieu || '',
    organizer: event.organisateur || '',
    desc: event.description || '',
    date: event.date?.slice(0, 10) || '',
    heure: event.heure || '',
    categorie: event.categorie || '',
    coOrganisateurs: event.coOrganisateurs || [],
    invitees: event.invitees || [],
    link: event.link || '',
    nom: event.nom || '',
    prenom: event.prenom || '',
    notification: event.notification || {
      type: 'Email',
      value: 30,
      unit: 'Minutes'
    }
  });

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [addedInvitees, setAddedInvitees] = useState([]);
  // At the top inside the component
  const [invitationId, setInvitationId] = useState(null);

  useEffect(() => {
    if (event.heure) {
      const [start, end] = event.heure.split(' - ');
      setStartTime(start || '');
      setEndTime(end || '');
    }
  }, [event]);
  const userId = localStorage.getItem('userId');
  const isOrganizer = event.organisateur === userId;

  const handleInvite = (invitees) => {
    const newInvitees = invitees.map(inv => ({
      nom: inv.nom || 'Inconnu',
      prenom: inv.prenom || '',
      email: inv.email
    }));

    setEditedEvent(prev => ({
      ...prev,
      invitees: [...(prev.invitees || []), ...newInvitees]
    }));

    setAddedInvitees(prev => [...prev, ...newInvitees]);
  };

  const handleChange = (field, value) => {
    setEditedEvent(prev => ({ ...prev, [field]: value }));
  };

  const handleRemove = (indexToRemove) => {
    const updated = [...editedEvent.invitees];
    updated.splice(indexToRemove, 1);
    setEditedEvent({ ...editedEvent, invitees: updated });
  };

  const handleSave = async () => {
    const fullTime = `${startTime} - ${endTime}`;
    const updatedEvent = {
      titre: editedEvent.title,
      description: editedEvent.desc,
      date: editedEvent.date,
      heure: fullTime,
      lieu: editedEvent.location,
      organisateur: editedEvent.organizer,
      coOrganisateurs: editedEvent.coOrganisateurs,
      categorie: editedEvent.categorie,
      invitees: editedEvent.invitees,
      link: editedEvent.link,
      nom: editedEvent.nom,
      prenom: editedEvent.prenom,
      notification: editedEvent.notification
    };

    try {
      await updateEvent(event._id, updatedEvent);

      for (const invitee of addedInvitees) {
        await sendInvitation(invitee.email, event._id);
      }

      setAddedInvitees([]);
      onEdit(updatedEvent);
      setEditing(false);
      alert('Event updated and invitations sent!');
    } catch (error) {
      console.error('Error updating event:', error);
      alert("Erreur lors de la mise à jour de l'événement");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');

    if (!isOrganizer && event._id && userId) {
      fetch(`http://localhost:5000/api/invitations/event/${event._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(invitations => {
          const match = invitations.find(inv => inv.id_utilisateur === userId);
          if (match) setInvitationId(match._id);
        })
        .catch(err => console.error("❌ Failed to fetch invitation ID", err));
    }
  }, [event._id, isOrganizer]);

  return (
    <div className="modal-overlay" onClick={onClose}>

      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className='event-header-title'>Event Details</h2>
          <span className="close-btn" onClick={onClose}>×</span>
        </div>

        <input className="full-input" value={editedEvent.title} onChange={e => handleChange('title', e.target.value)} disabled={!editing} />

        <div className="row">
          <input className="full-input" placeholder="Nom" value={editedEvent.nom} onChange={e => handleChange('nom', e.target.value)} disabled={!editing} />
          <input className="full-input" placeholder="Prenom" value={editedEvent.prenom} onChange={e => handleChange('prenom', e.target.value)} disabled={!editing} />
        </div>

        <div className="row">
          <div className='column'>
            <textarea className="desc-input" placeholder="Desc" value={editedEvent.desc} onChange={e => handleChange('desc', e.target.value)} disabled={!editing} />
            <div className="row">
              <input type="date" value={editedEvent.date} className="number-input" onChange={e => handleChange('date', e.target.value)} disabled={!editing} />
              {editing ? (
                <>
                  <input type="time" value={startTime} className="number-input" onChange={e => setStartTime(e.target.value)} />
                  <input type="time" value={endTime} className="number-input" onChange={e => setEndTime(e.target.value)} />
                </>
              ) : (
                <input type="text" value={editedEvent.heure} className="number-input" disabled />
              )}
            </div>
          </div>

          <div className="invite-box">
  <div className="invite-header">
    {editing && (
      <button className="invite-button" onClick={() => setShowInviteModal(true)}>+ Invite other people</button>
    )}
  </div>

  {showInviteModal && (
    <InvitePeopleModal onClose={() => setShowInviteModal(false)} onInvite={handleInvite} />
  )}

  {editedEvent.invitees.length === 0 ? (
    <p className="no-invitees">Aucun invité pour cet événement.</p>
  ) : (
    editedEvent.invitees.map((person, index) => (
      <div className="invitee" key={index}>
        <div className="person-info">
          <div className="name">{person.nom || 'Inconnu'} {person.prenom || ''}</div>
          <div className="email">{person.email}</div>
          {editing && <span className="delete-btn" onClick={() => handleRemove(index)}>×</span>}
        </div>
      </div>
    ))
  )}
</div>


        </div>

        <div className="row">
          {editing ? (
            <LocationSearch location={editedEvent.location} setLocation={val => handleChange('location', val)} />
          ) : (
            <input placeholder="Location" value={editedEvent.location} disabled className="full-input" />
          )}

          {editing ? (
            <input placeholder="Link" value={editedEvent.link} onChange={e => handleChange('link', e.target.value)} />
          ) : (
            <input placeholder="Link" value={editedEvent.link} disabled className="full-input" />
          )}
        </div>

        <div className="row">
          {editing ? (
            <select className='select-event event-type' value={editedEvent.categorie} onChange={e => handleChange('categorie', e.target.value)}>
              <option value="">Type of Meeting</option>
              <option value="réunion">Meeting</option>
              <option value="conférence">Conference</option>
              <option value="fête">Party</option>
              <option value="autre">Other</option>
            </select>
          ) : (
            <div className="full-input"><strong className='event-type'>Type of Meeting:</strong> {editedEvent.categorie}</div>
          )}

          <div className="notification-row">
            <span className='notif-text'>Notification</span>
            <select className='select-event' value={editedEvent.notification?.type || 'Email'} onChange={e => handleChange('notification', { ...editedEvent.notification, type: e.target.value })} disabled={!editing}>
              <option value="Email">Email</option>
              <option value="Popup">Popup</option>
            </select>
            <input type="number" value={editedEvent.notification?.value || 30} onChange={e => handleChange('notification', { ...editedEvent.notification, value: e.target.value })} min={0} className="number-input" disabled={!editing} />
            <select className='select-event' value={editedEvent.notification?.unit || 'Minutes'} onChange={e => handleChange('notification', { ...editedEvent.notification, unit: e.target.value })} disabled={!editing}>
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

              {isOrganizer ? (
                <button className="save-btn" onClick={() => setEditing(true)}>Edit</button>
              ) : (
                <button className="cancel-btn" onClick={async () => {
                  if (window.confirm('Retirer cet événement de votre calendrier ?')) {
                    try {
                      const token = localStorage.getItem('userToken');
                      await fetch(`http://localhost:5000/api/invitations/${invitationId}/decline`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      alert("Événement retiré.");
                      onDelete();
                      onClose();
                    } catch (err) {
                      console.error(err);
                      alert("Erreur lors du retrait.");
                    }
                  }
                }}>
                  Retirer l'événement
                </button>

              )}

            </>
          ) : (
            <>
              <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSave} disabled={!isOrganizer}>Save</button>
              {isOrganizer && (
                <button className="cancel-btn" onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this event?')) {
                    try {
                      await deleteEvent(event._id);
                      alert('Event deleted successfully!');
                      onDelete();
                      onClose();
                    } catch (err) {
                      console.error('Error deleting event:', err);
                      alert('Failed to delete event');
                    }
                  }
                }}>Delete</button>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default EventDetails;

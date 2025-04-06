import React, { useState } from 'react';
import './css/addEvent.css';
import people from './data.js';
import LocationSearch from './LocationSearch';


const AddEvent = ({ onClose, onSave }) => {
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
    const [peopleList, setPeopleList] = useState(people); // initialPeopleList = imported or defined data
    const handleRemove = (indexToRemove) => {
        setPeopleList(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const handleSave = () => {
        const event = {
            title,nom, prenom, desc, date, time, location, link, type,
            notification: { type: notificationType, value: notificationValue },
        };
        onSave(event);
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
                                <button className='invite-button'>+ Invite other people</button>
                            </div>

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
                            <option value="" className='option-event'>Type of Meeting</option>
                            <option value="Meeting" className='option-event'>Meeting</option>
                            <option value="Call" className='option-event'>Call</option>
                        </select>

                        <div className="notification-row">
                            <span className='notif-text'>Notification</span>
                            <select className='select-event' value={notificationType} onChange={e => setNotificationType(e.target.value)}>
                                <option value="Email" className='option-event'>Email</option>
                                <option value="Popup" className='option-event'>Popup</option>
                            </select>
                            <input
                                type="number"
                                value={notificationValue}
                                onChange={e => setNotificationValue(e.target.value)}
                                min={0} class="number-input"
                            />
                            <select className='select-event' value={notificationType} onChange={e => setNotificationType(e.target.value)}>
                                <option value="Minutes" className='option-event'>Minutes</option>
                                <option value="Heures" className='option-event'>Heures</option>
                                <option value="Jours" className='option-event'>Jours</option>
                                <option value="Mois" className='option-event'>Mois</option>
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
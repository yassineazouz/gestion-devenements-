// InvitePeopleModal.jsx
import React, { useState } from 'react';
import './css/invitePeopleModal.css';

const InvitePeopleModal = ({ onClose, onInvite }) => {
    const [email, setEmail] = useState('');
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [invitees, setInvitees] = useState([]);

    const addInvitee = () => {
        if (email.trim()) {
            setInvitees([...invitees, {
                email: email.trim(),
                nom: nom.trim(),
                prenom: prenom.trim()
            }]);
            setEmail('');
            setNom('');
            setPrenom('');
        }
    };

    const handleSend = () => {
        onInvite(invitees);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
                <div className="invite-modal-header">
                    <h3>Invite People</h3>
                    <span className="close-invite" onClick={onClose}>×</span>
                </div>
                <div className="email-div">
                    <div className='input-row'>
                        <input
                        type="text"
                        placeholder="Prénom"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        className="email-input"
                    />
                    <input
                        type="text"
                        placeholder="Nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="email-input"
                    />
                    </div>
                    
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="email-input"
                    />
                    <button className="add-btn" onClick={addInvitee}>Add</button>
                </div>

                <ul className="invitee-list">
                    {invitees.map((i, index) => (
                        <li key={index}>{i.prenom} {i.nom} ({i.email})</li>
                    ))}
                </ul>

                <button className="send-btn" onClick={handleSend}>Send Invites</button>
            </div>
        </div>
    );
};

export default InvitePeopleModal;

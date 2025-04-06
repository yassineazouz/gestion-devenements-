import React, { useState } from 'react';
import './css/invitePeopleModal.css';

const InvitePeopleModal = ({ onClose, onInvite }) => {
    const [inputEmail, setInputEmail] = useState('');
    const [invitees, setInvitees] = useState([]);

    const addEmail = () => {
        if (inputEmail.trim()) {
            setInvitees([...invitees, inputEmail.trim()]);
            setInputEmail('');
        }
    };

    const handleSend = () => {
        onInvite(invitees);
        onClose();
    };

    return (
        <div className="invite-modal-overlay">
            <div className="invite-modal">
                <div className="invite-modal-header">
                    <h3>Invite People</h3>
                    <span className="close-invite" onClick={onClose}>×</span>
                </div>
                <div className='email-div'>
                    <input
                        type="email"
                        placeholder="Enter email"
                        className='email-input'
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                    />
                    <button className="add-btn" onClick={addEmail}>Add</button>
                </div>

                <ul className="invitee-list">
                    {invitees.map((email, i) => (
                        <li key={i}>{email}</li>
                    ))}
                </ul>

                <button className="send-btn" onClick={handleSend}>Send Invites</button>
            </div>
        </div>
    );
};

export default InvitePeopleModal;

import React, { useState } from 'react';
import axios from 'axios';
import './css/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la demande.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Réinitialiser le mot de passe</h2>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <input className='form-input'
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Envoyer le lien</button>
      </form>
    </div>
  );
};

export default ForgotPassword;

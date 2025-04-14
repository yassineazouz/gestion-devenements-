import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Auth.css'; // ← use same styles as login/register

const ResetPassword = () => {
  const { token } = useParams();
  const [mot_de_passe, setMotDePasse] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mot_de_passe !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, {
        mot_de_passe
      });

      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Réinitialiser le mot de passe</h2>

        {message && <p className="error">{message}</p>}

        <input
          className="form-input"
          type="password"
          placeholder="Nouveau mot de passe"
          value={mot_de_passe}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />

        <input
          className="form-input"
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Réinitialiser</button>
      </form>
    </div>
  );
};

export default ResetPassword;

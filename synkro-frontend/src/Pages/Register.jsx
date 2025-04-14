import React, { useState } from 'react';
import { registerUser } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';
import './css/Auth.css';

const Register = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await registerUser({ nom,prenom, email, mot_de_passe });
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userId', data._id);
      navigate('/calendar');
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de l’inscription';
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleRegister}>
        <h2>Créer un compte</h2>
        {error && <p className="error">{error}</p>}
        <input className='form-input' type="text" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
        <input className='form-input' type="text" placeholder="Prenom" value={prenom} onChange={e => setPrenom(e.target.value)} required />
        <input className='form-input' type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className='form-input' type="password" placeholder="Mot de passe" value={mot_de_passe} onChange={e => setMotDePasse(e.target.value)} required />
        <button type="submit">S'inscrire</button>
        <p className="auth-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
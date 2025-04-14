import React, { useState } from 'react';
import { loginUser } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';
import './css/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser({ email, mot_de_passe });
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userId', data.user._id);
      navigate('/calendar');
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la connexion';
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Connexion</h2>
        {error && <p className="error">{error}</p>}
        <input className='form-input' type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className='form-input' type="password" placeholder="Mot de passe" value={mot_de_passe} onChange={e => setMotDePasse(e.target.value)} required />
        <button type="submit">Se connecter</button>
        <p className="auth-link">
          Pas encore inscrit ? <Link to="/register">Créer un compte</Link>
        </p>
        <p className="auth-link">
  <Link to="/forgot-password">Mot de passe oublié ?</Link>
</p>

      </form>
    </div>
  );
};

export default Login;
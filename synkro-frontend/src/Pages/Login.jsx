import React, { useState } from 'react';
import { loginUser } from '../services/auth';

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMotDePasse] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, mot_de_passe });
      console.log('✅ User logged in:', data);
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userId', data._id);
      alert('Connexion réussie !');
      onSuccess(); // Notify App that user is logged in
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de la connexion";
      console.error('❌ Login error:', msg);
      alert(msg);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={mot_de_passe} onChange={e => setMotDePasse(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

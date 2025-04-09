// Register.jsx
import React, { useState } from 'react';
import { registerUser } from '../services/auth';

const Register = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMotDePasse] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = { nom, email, mot_de_passe };
      console.log('📦 Data sent to backend:', payload);
  
      const data = await registerUser(payload);
      console.log('✅ User registered:', data);
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userId', data._id);
      alert("Utilisateur inscrit !");
    } catch (err) {
            const msg = err.response?.data?.message || "Erreur lors de l'inscription";
            console.error('❌ Register error:', msg);
            alert(msg);
          
          
    }
  };
  
  return (
    <form onSubmit={handleRegister}>
      <input type="text" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={mot_de_passe} onChange={e => setMotDePasse(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;

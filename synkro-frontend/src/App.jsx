import React, { useState } from 'react';
import Register from './Pages/Register';
import Login from './Pages/Login';
import HomeCalendar from './Pages/HomeCalendar';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const handleAuth = () => {
    setUserId(localStorage.getItem('userId'));
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userToken');
    setUserId(null);
  };

  if (!userId) {
    return (
      <>
        <Register onSuccess={handleAuth} />
        <Login onSuccess={handleAuth} />
      </>
    );
  }

  return (
    <div>
      <button onClick={handleLogout} style={{ margin: '10px', padding: '8px 12px' }}>
        Logout
      </button>
      <HomeCalendar onClose={() => {}} />
    </div>
  );
}

export default App;


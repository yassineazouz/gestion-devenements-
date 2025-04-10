import React, { useState } from 'react';
import Register from './Pages/Register';
import Login from './Pages/Login';
import HomeCalendar from './Pages/HomeCalendar';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const handleAuth = () => {
    setUserId(localStorage.getItem('userId'));
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
      <HomeCalendar onClose={() => {}} />
    </div>
  );
}

export default App;


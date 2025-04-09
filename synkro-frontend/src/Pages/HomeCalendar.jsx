import React, { useState, useEffect, useRef } from 'react';
import './css/homeCalendar.css';
import LittleCalendar from '../Components/LittleCalendar';
import EventList from '../Components/EventList';
import Calendar from '../Components/Calendar';
import AddEvent from '../Components/AddEvent';
import EventDetails from '../Components/EventDetails';
import UserMenu from '../Components/UserMenu';

const HomeCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarF1Ref = useRef(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    const div = calendarF1Ref.current;
    const handleScroll = () => {
      if (div.scrollTop > 0) {
        div.classList.add('scrolling');
      } else {
        div.classList.remove('scrolling');
      }
    };
    div.addEventListener('scroll', handleScroll);
    return () => div.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='home-body'>
      <div ref={calendarF1Ref} className='calendar-f1'>
        <div className='synkro-logo'>
          <img src='https://i.postimg.cc/ZRzzGKZL/synkro.png' className='logo' alt='synkro logo' />
        </div>
        <LittleCalendar value={selectedDate} onChange={setSelectedDate} />
        <EventList startDate={selectedDate} />
      </div>

      <div className='calendar-f2'>
        <div className='user-menu-wrapper'>
          <UserMenu
            userName={localStorage.getItem('userName') || 'User'}
            onLogout={handleLogout}
            onAddEvent={() => setShowAddEvent(true)}
            onSettings={() => alert('Settings')}
          />
        </div>

        <Calendar
          currentDate={selectedDate}
          setCurrentDate={setSelectedDate}
          onAddEventClick={() => setShowAddEvent(true)}
          onEventClick={handleEventClick}
        />

        {selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>

      {showAddEvent && (
        <AddEvent
          onClose={() => setShowAddEvent(false)}
          onSave={(eventData) => {
            console.log('Event saved:', eventData);
            setShowAddEvent(false);
          }}
        />
      )}
    </div>
  );
};

export default HomeCalendar;

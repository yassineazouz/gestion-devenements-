import React, { useState, useEffect, useRef } from 'react';
import './css/homeCalendar.css';
import LittleCalendar from '../Components/LittleCalendar';
import EventList from '../Components/EventList';
import Calendar from '../Components/Calendar';
import AddEvent from '../Components/AddEvent';
import EventDetails from '../Components/EventDetails';
import { fetchEvents } from '../services/event';

const HomeCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventList, setEventList] = useState([]);
  const calendarF1Ref = useRef(null);

  const handleEventClick = (event) => setSelectedEvent(event);

  useEffect(() => {
    fetchEvents().then(setEventList).catch(console.error);
  }, []);

  const refreshEvents = async () => {
    const updated = await fetchEvents();
    setEventList(updated);
  };

  return (
    <div className='home-body'>
      <div ref={calendarF1Ref} className='calendar-f1'>
        <div className='synkro-logo'>
          <img src='https://i.postimg.cc/ZRzzGKZL/synkro.png' className='logo' alt='synkro logo' />
        </div>
        <LittleCalendar value={selectedDate} onChange={setSelectedDate} />
        <EventList
          startDate={selectedDate}
          events={eventList}
          onEventClick={(e) => setSelectedEvent(e)} // ✅ this must be passed
        />

      </div>

      <div className='calendar-f2'>
        <Calendar
          currentDate={selectedDate}
          setCurrentDate={setSelectedDate}
          onAddEventClick={() => setShowAddEvent(true)}
          onEventClick={handleEventClick}
          events={eventList}
        />
        {selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEdit={() => refreshEvents()}
            onDelete={() => {
              refreshEvents();
              setSelectedEvent(null); // Close modal after delete
            }}
          />
        )}

      </div>

      {showAddEvent && (
        <AddEvent
          onClose={() => setShowAddEvent(false)}
          onSave={() => {
            refreshEvents(); // ✅ Refresh the list after save
            setShowAddEvent(false);
          }}
        />
      )}
    </div>
  );
};

export default HomeCalendar;

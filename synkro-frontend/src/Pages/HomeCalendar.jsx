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

  const refreshEvents = async () => {
    try {
      const updated = await fetchEvents();
      setEventList(updated);
    } catch (error) {
      console.error('❌ Failed to fetch events:', error);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, []);

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
          onEventClick={handleEventClick}
        />
      </div>

      <div className='calendar-f2'>
        <Calendar
          currentDate={selectedDate}
          setCurrentDate={setSelectedDate}
          onAddEventClick={() => setShowAddEvent(true)}
          onEventClick={handleEventClick}
          events={eventList}
          onRefreshEvents={refreshEvents} // ✅ pass refresh function
        />


        {selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEdit={refreshEvents}
            onDelete={() => {
              refreshEvents();
              setSelectedEvent(null);
            }}
          />
        )}
      </div>

      {showAddEvent && (
        <AddEvent
          onClose={() => setShowAddEvent(false)}
          onSave={() => {
            refreshEvents();
            setShowAddEvent(false);
          }}
        />
      )}
    </div>
  );
};

export default HomeCalendar;

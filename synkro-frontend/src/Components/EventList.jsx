import React from 'react';
import { getNextDays, formatDate } from '../utils/dateUtils';
import events from './events';
import './css/eventList.css';
import { getColorForDate } from '../utils/colorMap';


const EventList = ({ startDate }) => {
  const days = getNextDays(startDate);
  const dayColors = ['#CD7B60', '#569CD6', '#B388EB', '#F2C94C', '#6FCF97', '#F2994A', '#EB5757'];

  const colorMap = {};
  days.forEach((date, idx) => {
    colorMap[date.toISOString().split('T')[0]] = dayColors[idx % dayColors.length];
  });

  return (
    <div className="event-list">
      {days.map((date, idx) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayEvents = events.filter((e) => e.date === dateStr);

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const label =
          date.toDateString() === today.toDateString()
            ? 'AUJOURD’HUI'
            : date.toDateString() === tomorrow.toDateString()
            ? 'DEMAIN'
            : date.toLocaleDateString('fr-FR', { weekday: 'long' }).toUpperCase();

        return (
          <div key={idx} className="day-block">
            <div className="day-title">{label} {formatDate(date)}</div>
            {dayEvents.length > 0 ? (
              dayEvents.map((event, i) => (
                <div key={i} className="event">
                  <span className="dot" style={{ backgroundColor: getColorForDate(dateStr) }}
                  ></span>
                  <div>
                    <div className="time">{event.time}</div>
                    <div className="title">{event.title}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events"><span className="dot gray" /> No events</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EventList;

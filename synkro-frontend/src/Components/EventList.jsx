import React from 'react';
import { getNextDays, formatDate } from '../utils/dateUtils';
import events from './events';
import './css/eventList.css';

const EventList = ({ startDate }) => {
  const days = getNextDays(startDate);
  const dayColors = ['#CD7B60', '#569CD6', '#B388EB', '#F2C94C', '#6FCF97', '#F2994A', '#EB5757'];

  return (
    <div className="event-list">
      {days.map((date, idx) => {
        const label =
          idx === 0
            ? 'TODAY'
            : idx === 1
            ? 'TOMORROW'
            : date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

        const dateStr = date.toISOString().split('T')[0];

        const dayEvents = events.filter((e) => e.date === dateStr);

        return (
          <div key={idx} className="day-block">
            <div className="day-title">{label} {formatDate(date)}</div>
            {dayEvents.length > 0 ? (
              dayEvents.map((event, i) => (
                <div key={i} className="event">
<span className="dot" style={{ backgroundColor: dayColors[idx % dayColors.length] }}></span>
<div>
                    <div className="time">{event.time}</div>
                    <div className="title"><strong>{event.title}</strong></div>
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

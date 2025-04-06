import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './css/calendar.css';
import events from './events';
import { getNextDays } from '../utils/dateUtils';
import { getColorForDate } from '../utils/colorMap';


const hours = Array.from({ length: 24 }, (_, i) => i);
const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const Calendar = ({ currentDate, setCurrentDate, onAddEventClick, onEventClick }) => {
  const CELL_HEIGHT = 60;
  const eventColors = ['#CD7B60', '#569CD6', '#B388EB', '#F2C94C', '#6FCF97', '#F2994A', '#EB5757'];
  const [viewMode, setViewMode] = useState('week');
  const calendarBodyRef = useRef(null);

  useLayoutEffect(() => {
    const updateScrollOverflow = () => {
      if (!calendarBodyRef.current) return;
      const totalCalendarHeight = calendarBodyRef.current.scrollHeight;
      const availableHeight = window.innerHeight - calendarBodyRef.current.getBoundingClientRect().top;
      calendarBodyRef.current.style.overflowY = totalCalendarHeight > availableHeight ? 'scroll' : 'hidden';
    };
    window.addEventListener('resize', updateScrollOverflow);
    updateScrollOverflow();
    return () => window.removeEventListener('resize', updateScrollOverflow);
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === 'week' && calendarBodyRef.current) {
      const now = new Date();
      calendarBodyRef.current.scrollTop = now.getHours() * 60;
    }
  }, [viewMode]);

  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day + 6) % 7;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };


  const getWeekDays = () => {
    const start = new Date(startOfWeek(currentDate));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = new Date(firstDayOfMonth);
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
    startDay.setDate(1 - startOffset);

    const lastDayOfMonth = new Date(year, month + 1, 0);
    const endDay = new Date(lastDayOfMonth);
    const endOffset = 6 - ((lastDayOfMonth.getDay() + 6) % 7);
    endDay.setDate(lastDayOfMonth.getDate() + endOffset);

    const days = [];
    for (let d = new Date(startDay); d <= endDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const nextPeriod = () => {
    const next = new Date(currentDate);
    if (viewMode === 'week') next.setDate(currentDate.getDate() + 7);
    else next.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(next);
  };

  const prevPeriod = () => {
    const prev = new Date(currentDate);
    if (viewMode === 'week') prev.setDate(currentDate.getDate() - 7);
    else prev.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prev);
  };

  const formatCurrentDate = () =>
    viewMode === 'week'
      ? currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
      : currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const handleMonthDayClick = (date) => {
    setCurrentDate(date);
    setViewMode('week');
  };

  const weekDays = getWeekDays();
  const monthDays = getMonthDays();
  const currentMonth = currentDate.getMonth();
  const localTimezoneOffset = -new Date().getTimezoneOffset() / 60;
  const todayStr = new Date().toDateString();

  const weekColorMap = {};
  getNextDays(currentDate).forEach((d, i) => {
    weekColorMap[d.toISOString().split('T')[0]] = eventColors[i % eventColors.length];
  });

  return (
    <div className="calendar-container">
      <div className="calendar-header redesigned">
        <div className="left-controls">
          <div className='nav-button-div'>
            <button onClick={prevPeriod} className="nav-button left-button">❮</button>
            <button onClick={nextPeriod} className="nav-button right-button">❯</button>
          </div>
          <span className="current-date">{formatCurrentDate()}</span>
        </div>
        <div className="right-controls">
          <button onClick={() => setCurrentDate(new Date())} className="today-button">Aujourd’hui</button>
          <div className="view-mode-wrapper">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="view-mode"
            >
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
            </select>
          </div>
          <button className="add-event" onClick={onAddEventClick}>
            <span className='plus-button'>＋</span> Ajouter un événement
          </button>

          <button className="account-btn">●</button>
        </div>
      </div>

      <div className="calendar-body" ref={calendarBodyRef}>
        {viewMode === 'week' ? (
          <div className="calendar-grid">
            <div className="time-column">
              <div className="tz-label time-slot">GMT {localTimezoneOffset >= 0 ? '+' : ''}{localTimezoneOffset}</div>
              {hours.map((h, i) => (
                <div key={i} className="time-slot no-top-padding">{h}h</div>
              ))}
            </div>

            {weekDays.map((date, i) => {
              const dateStr = date.toISOString().split('T')[0];
              const dayEvents = events.filter(e => e.date === dateStr);
              const isToday = date.toDateString() === todayStr;
              return (
                <div key={i} className={`day-column ${isToday ? 'highlighted-day' : ''}`}>
                  <div className="day-header">
                    <div className='day-week'>{daysOfWeek[(date.getDay() + 6) % 7]}</div>
                    <div className='day-number'>{date.getDate()}</div>
                  </div>

                  {hours.map((_, j) => (
                    <div key={j} className={`hour-cell ${isToday ? 'highlighted-day' : ''}`} onClick={onAddEventClick}></div>
                  ))}

                  <div className="event-overlay">
                    {dayEvents.map((event, idx) => {
                      const [startTime, endTime] = event.time.split(' - ');
                      const [startHour, startMin] = startTime.split(':').map(Number);
                      const [endHour, endMin] = endTime.split(':').map(Number);

                      const eventStart = startHour * 60 + startMin;
                      const eventEnd = endHour * 60 + endMin;
                      const eventDuration = eventEnd - eventStart;

                      const top = 82 + (eventStart * CELL_HEIGHT) / 60;
                      const height = (eventDuration * CELL_HEIGHT) / 60;

                      return (
                        <div
                          key={idx}
                          className="calendar-event"
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            backgroundColor: getColorForDate(dateStr)
                          }}
                          title={event.title}
                          onClick={() => onEventClick(event)} // << This opens the event details
                        >
                          <div className="event-time">{event.time}</div>
                          <div className="event-title">{event.title}</div>
                        </div>


                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="time-column right">
              <div className="tz-label time-slot">GMT {localTimezoneOffset >= 0 ? '+' : ''}{localTimezoneOffset}</div>
              {hours.map((h, i) => (
                <div key={i} className="time-slot no-top-padding">{h}h</div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="month-weekdays">
              {daysOfWeek.map((day, i) => (
                <div key={i} className="weekday-label">{day}</div>
              ))}
            </div>

            <div className="month-grid">
              {monthDays.map((date, i) => {
                const isToday = date.toDateString() === todayStr;
                const dateStr = date.toISOString().split('T')[0];
                return (
                  <div
                    key={i}
                    className={`month-day ${date.getMonth() !== currentMonth ? 'faded' : ''} ${isToday ? 'highlighted-day' : ''}`}
                    onClick={() => handleMonthDayClick(date)}
                  >
                    <div className="month-day-label">{date.getDate()}</div>
                    <div className="month-dots">
                      {events
                        .filter(e => e.date === dateStr)
                        .map((e, idx) => (
                          <div
                            key={idx}
                            className="month-dot-line"
                            title={`${e.time} - ${e.title}`}
                          >
                            <span
                              className="month-dot"
                              style={{ backgroundColor: getColorForDate(dateStr) }}
                            />
                            <div className="month-dot-text">
                              <span className="dot-time">{e.time.split(' - ')[0]}</span>{' '}
                              <span className="dot-title">{e.title}</span>
                            </div>
                          </div>
                        ))}
                    </div>

                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;
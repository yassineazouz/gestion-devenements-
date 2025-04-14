import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './css/calendar.css';
import { getColorForDate } from '../utils/colorMap';
import UserMenu from './UserMenu';
import axios from 'axios';

const hours = Array.from({ length: 24 }, (_, i) => i);
const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const Calendar = ({ currentDate, setCurrentDate, onAddEventClick, onEventClick, events, onRefreshEvents }) => {
  const CELL_HEIGHT = 60;
  const calendarBodyRef = useRef(null);
  const [viewMode, setViewMode] = useState('week');
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifWindow, setShowNotifWindow] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const notifWindowRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifWindowRef.current && !notifWindowRef.current.contains(e.target)) {
        setShowNotifWindow(false);
      }
    };
  
    if (showNotifWindow) {
      document.addEventListener('mousedown', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifWindow]);
  
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const userId = localStorage.getItem('userId');
  const loadInvitations = () => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/users/${userId}/invitations`)
        .then(res => setInvitations(res.data))
        .catch(err => console.error("Failed to fetch invitations:", err));
    }
  };
  useEffect(() => {
    loadInvitations();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/users/${userId}/invitations`)
        .then(res => {
          const pending = res.data.filter(inv => inv.statut === 'envoyée');
          setInvitations(pending);
        })
        .catch(err => console.error("Failed to fetch invitations:", err));


    }
  }, [userId]);
  const handleAccept = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/invitations/${id}/accept`);
      await onRefreshEvents();
      await loadInvitations();
      setShowNotifWindow(false); // 👈 close after accepting
    } catch (e) {
      console.error('Accept failed', e);
    }
  };
  
  const handleDecline = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/invitations/${id}/decline`);
      await onRefreshEvents();
      await loadInvitations();
      setShowNotifWindow(false); // 👈 close after declining
    } catch (e) {
      console.error('Decline failed', e);
    }
  };
  


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
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    firstDay.setDate(firstDay.getDate() - startOffset);
    const lastDay = new Date(year, month + 1, 0);
    const endOffset = 6 - ((lastDay.getDay() + 6) % 7);
    lastDay.setDate(lastDay.getDate() + endOffset);

    const days = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const nextPeriod = () => {
    const next = new Date(currentDate);
    if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const prevPeriod = () => {
    const prev = new Date(currentDate);
    if (viewMode === 'week') prev.setDate(prev.getDate() - 7);
    else prev.setMonth(prev.getMonth() - 1);
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
  useEffect(() => {
    const fetchInvitationsWithEventDetails = async () => {
      if (!userId) return;
  
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${userId}/invitations`);
        const invitations = res.data;
  
        // Fetch the event details for each invitation
        const detailedInvitations = await Promise.all(
          invitations.map(async (inv) => {
            try {
              const token = localStorage.getItem("token");
              const eventRes = await axios.get(`http://localhost:5000/api/events/${inv.evenement}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
                            return {
                ...inv,
                evenement: eventRes.data // replace ID with full object
              };
            } catch (e) {
              console.error("Failed to fetch event details for invitation", inv._id);
              return inv;
            }
          })
        );
  
        const pending = detailedInvitations.filter(inv => inv.statut === 'envoyée');
        setInvitations(pending);
      } catch (err) {
        console.error("Failed to fetch invitations:", err);
      }
    };
  
    fetchInvitationsWithEventDetails();
  }, [userId]);
  

  const weekDays = getWeekDays();
  const monthDays = getMonthDays();
  const currentMonth = currentDate.getMonth();
  const todayStr = new Date().toDateString();
  const timezoneOffset = -new Date().getTimezoneOffset() / 60;
  const [userNom, setUserNom] = useState(localStorage.getItem("userNom") || "");
  const [userPrenom, setUserPrenom] = useState(localStorage.getItem("userPrenom") || "");
  

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
            <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="view-mode">
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
            </select>
          </div>
          <button className="add-event" onClick={onAddEventClick}>
            <span className='plus-button'>＋</span> Ajouter un événement
          </button>
          <button className="account-btn" onClick={() => setShowMenu(!showMenu)}>●</button>

          {showMenu && (
            <UserMenu
              userName={`${userPrenom} ${userNom}`}
              onAddEvent={onAddEventClick}
              onLogout={handleLogout}
              onClose={() => setShowMenu(false)}
              invitations={invitations}
              onOpenNotifications={() => setShowNotifWindow(true)}
            />

          )}
        </div>
      </div>

      {showNotifWindow && (
        <div className="notif-window" ref={notifWindowRef}>
          <div className="notif-header">
            <h3 className='notif-title'>Invitations reçues</h3>
            <h2 className="notif-close close-btn01" onClick={() => setShowNotifWindow(false)}>×</h2>
          </div>
          <ul className="notif-list">
            {invitations.length === 0 ? (
              <p className='no-invite'>Aucune invitation</p>
            ) : (
              invitations.map(inv => (
                <li key={inv._id} className="notif-item">
                  <p className='invitation'>
                    Vous êtes invité à {inv.evenement?.titre} par {inv.evenement?.nom} {inv.evenement?.prenom}
                  </p>
                  <div className='invite-buttons'><button onClick={() => handleAccept(inv._id)} className='invite-desc'>Accepter</button>
                    <button className='invite-desc' onClick={() => handleDecline(inv._id)}
                    >Refuser</button></div>

                </li>
              ))
            )}
          </ul>
        </div>
      )}

      <div className="calendar-body" ref={calendarBodyRef}>
        {viewMode === 'week' ? (
          <div className="calendar-grid">
            <div className="time-column">
              <div className="tz-label time-slot">GMT {timezoneOffset >= 0 ? '+' : ''}{timezoneOffset}</div>
              {hours.map(h => (
                <div key={h} className="time-slot no-top-padding">{h}h</div>
              ))}
            </div>

            {weekDays.map((date, i) => {
              const dateStr = date.toLocaleDateString('fr-CA');
              const isToday = date.toDateString() === todayStr;
              const eventsForDay = events.filter(e =>
                e.date && new Date(e.date).toLocaleDateString('fr-CA') === dateStr
              );

              return (
                <div key={i} className={`day-column ${isToday ? 'highlighted-day' : ''}`}>
                  <div className="day-header">
                    <div className="day-week">{daysOfWeek[(date.getDay() + 6) % 7]}</div>
                    <div className="day-number">{date.getDate()}</div>
                  </div>

                  {hours.map((_, j) => (
                    <div key={j} className={`hour-cell ${isToday ? 'highlighted-day' : ''}`} onClick={onAddEventClick}></div>
                  ))}

                  <div className="event-overlay">
                    {eventsForDay.map((e, idx) => {
                      if (!e.heure || !e.heure.includes(':')) return null;

                      const [startTime, endTime] = e.heure.split(' - ');
                      if (!startTime || !endTime) return null;

                      const [startHour = 0, startMin = 0] = startTime.split(':').map(Number);
                      const [endHour = 0, endMin = 0] = endTime.split(':').map(Number);

                      const start = startHour * 60 + startMin;
                      const end = endHour * 60 + endMin;
                      const height = ((end - start) * CELL_HEIGHT) / 60;
                      const top = 82 + (start * CELL_HEIGHT) / 60;

                      return (
                        <div
                          key={idx}
                          className="calendar-event"
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            backgroundColor: getColorForDate(dateStr)
                          }}
                          onClick={() => onEventClick(e)}
                          title={e.titre}
                        >
                          <div className="event-content">
                            <div className="event-time">{e.heure}</div>
                            <div className="event-title">{e.titre}</div>
                            <div className="event-type">{e.categorie}</div>
                            <div className="event-organizer">{e.nom} {e.prenom}</div>
                            <div className="event-location">{(e.lieu || '').split(',')[3]}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="time-column right">
              <div className="tz-label time-slot">GMT {timezoneOffset >= 0 ? '+' : ''}{timezoneOffset}</div>
              {hours.map(h => (
                <div key={h} className="time-slot no-top-padding">{h}h</div>
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
                const dateStr = date.toLocaleDateString('fr-CA');
                const eventsForDay = events.filter(e =>
                  e.date && new Date(e.date).toLocaleDateString('fr-CA') === dateStr
                );

                return (
                  <div
                    key={i}
                    className={`month-day ${date.getMonth() !== currentMonth ? 'faded' : ''} ${isToday ? 'highlighted-day' : ''}`}
                    onClick={() => handleMonthDayClick(date)}
                  >
                    <div className="month-day-label">{date.getDate()}</div>
                    <div className="month-dots">
                      {eventsForDay.map((e, idx) => (
                        <div key={idx} className="month-dot-line" title={`${e.heure || ''} - ${e.titre}`}>
                          <span
                            className="month-dot"
                            style={{ backgroundColor: getColorForDate(dateStr) }}
                          />
                          <div className="month-dot-text">
                            <span className="dot-time">{e.heure}</span>{' '}
                            <span className="dot-title">{e.titre}</span>
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

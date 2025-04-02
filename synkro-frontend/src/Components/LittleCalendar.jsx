import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './css/littleCalendar.css';

const LittleCalendar = ({ onChange, value }) => {
  return (
    <div className="calendar-wrapper" style={{ width: 'fit-content'}}>
      <Calendar
        onChange={onChange}
        value={value}
        prev2Label={null}
        next2Label={null}
        navigationLabel={({ label }) => <span className="calendar-title">{label}</span>}
      />
    </div>
  );
};

export default LittleCalendar;

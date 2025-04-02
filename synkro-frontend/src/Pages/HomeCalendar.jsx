import React, { useState } from 'react';
import './css/homeCalendar.css'
import LittleCalendar from '../Components/LittleCalendar';
import EventList from '../Components/EventList';
import CalendatNavbar from '../Components/CalendarNavbar';
import Calendar from '../Components/Calendar';

const HomeCalendar = () => {

    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div className='home-body'>
            <div className='calendar-f1'>
                <div className='synkro-logo'><img src='https://cdn.discordapp.com/attachments/1349317710072250406/1354441545260208270/logo_synkro.png?ex=67eddf3c&is=67ec8dbc&hm=ce4fa8a23f3dad43bd499ae07942733168f805dc220247f464ef42acc293ad55&' className='logo' alt='synkro logo' /></div>
                <LittleCalendar value={selectedDate} onChange={setSelectedDate} />
                <EventList startDate={selectedDate} />
            </div>
            <div className='calendar-f2'>
                <CalendatNavbar />
                <Calendar />
            </div>

        </div>
    )
}

export default HomeCalendar

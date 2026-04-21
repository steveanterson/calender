import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useCalendarStore } from '../store/useCalendarStore';

// View placeholders
import MonthView from '../components/calendar/MonthView';
import WeekView from '../components/calendar/WeekView';
import DayView from '../components/calendar/DayView';
import AgendaView from '../components/calendar/AgendaView';

export default function CalendarPage() {
  const { viewType } = useCalendarStore();

  const renderView = () => {
    switch (viewType) {
      case 'day': return <DayView />;
      case 'week': return <WeekView />;
      case 'month': return <MonthView />;
      case 'agenda': return <AgendaView />;
      default: return <MonthView />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex flex-col relative w-full h-full">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

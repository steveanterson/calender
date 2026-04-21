import React, { useMemo } from 'react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { getMonthGridDays } from '../../utils/dateUtils';
import { expandRecurringEvents } from '../../utils/recurrenceUtils';
import { format, isSameMonth, isToday, startOfMonth, endOfMonth, min } from 'date-fns';

export default function MonthView() {
  const { currentDate, events } = useCalendarStore();
  const dateObj = new Date(currentDate);
  const gridDays = getMonthGridDays(dateObj);
  
  const viewStart = gridDays[0];
  const viewEnd = gridDays[gridDays.length - 1];
  
  const visibleEvents = expandRecurringEvents(events, viewStart, viewEnd);

  const getDayEvents = (day) => {
    return visibleEvents.filter(e => {
      const eStart = new Date(e.start);
      return format(eStart, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
  };

  const handleDayClick = (day) => {
    // Optionally open event dialog for specific day
    window.dispatchEvent(new CustomEvent('openEventModal', {
      detail: { start: day.toISOString() }
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Header Days */}
      <div className="grid grid-cols-7 border-b border-google-border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center py-2 text-xs font-medium text-gray-500 border-r border-google-border last:border-r-0">
            {day.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-[repeat(auto-fit,minmax(0,1fr))] overflow-hidden">
        {gridDays.map((date, idx) => {
          const isCurrMonth = isSameMonth(date, dateObj);
          const isTodayDate = isToday(date);
          const dayEvents = getDayEvents(date);

          return (
            <div 
              key={idx} 
              onClick={() => handleDayClick(date)}
              className={`min-h-[100px] border-b border-r border-google-border p-1 ${!isCurrMonth ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-50 transition cursor-pointer overflow-hidden flex flex-col`}
            >
              <div className="text-center mb-1">
                <span className={`inline-flex items-center justify-center w-6 h-6 text-sm rounded-full ${isTodayDate ? 'bg-google-blue text-white font-medium' : isCurrMonth ? 'text-gray-700' : 'text-gray-400'}`}>
                  {format(date, 'd')}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                {dayEvents.map(evt => (
                  <div 
                    key={evt.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.dispatchEvent(new CustomEvent('openEventModal', { detail: { event: evt } }));
                    }}
                    className="truncate px-1.5 py-0.5 rounded text-xs text-white"
                    style={{ backgroundColor: evt.color || '#1a73e8' }}
                  >
                    {!evt.allDay && <span className="mr-1">{format(new Date(evt.start), 'HH:mm')}</span>}
                    {evt.title || '(No title)'}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

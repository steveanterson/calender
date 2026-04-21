import React, { useMemo } from 'react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { expandRecurringEvents } from '../../utils/recurrenceUtils';
import { startOfDay, addDays, format, isSameDay } from 'date-fns';

export default function AgendaView() {
  const { events, currentDate } = useCalendarStore();

  const viewStart = startOfDay(new Date(currentDate));
  // Show 30 days ahead
  const viewEnd = addDays(viewStart, 30);
  
  const visibleEvents = expandRecurringEvents(events, viewStart, viewEnd);

  // Group by day
  const grouped = useMemo(() => {
    const sorted = [...visibleEvents].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const groups = [];
    
    sorted.forEach(evt => {
      const dateStr = format(new Date(evt.start), 'yyyy-MM-dd');
      let group = groups.find(g => g.date === dateStr);
      if (!group) {
        group = { date: dateStr, dateObj: new Date(evt.start), events: [] };
        groups.push(group);
      }
      group.events.push(evt);
    });

    return groups;
  }, [visibleEvents]);

  return (
    <div className="flex-1 bg-white overflow-y-auto p-4 md:px-20 max-w-4xl mx-auto w-full">
      {grouped.length === 0 ? (
        <div className="text-gray-500 mt-10 text-center">No upcoming events.</div>
      ) : (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.date} className="flex flex-col md:flex-row shadow border border-gray-100 rounded-lg overflow-hidden">
              <div className="md:w-32 bg-gray-50 p-4 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center justify-center">
                <span className="text-xl font-medium text-gray-700">{format(group.dateObj, 'd')}</span>
                <span className="text-sm text-gray-500">{format(group.dateObj, 'MMM')} {format(group.dateObj, 'EEE')}</span>
              </div>
              <div className="flex-1 divide-y divide-gray-50">
                {group.events.map(evt => (
                  <div 
                    key={evt.id}
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('openEventModal', { detail: { event: evt } }));
                    }}
                    className="p-4 hover:bg-gray-50 cursor-pointer flex items-center group transition"
                  >
                    <div className="w-3 h-3 rounded-full mr-4" style={{ backgroundColor: evt.color || '#1a73e8' }} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{evt.title || '(No title)'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {format(new Date(evt.start), 'h:mm a')} - {format(new Date(evt.end), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

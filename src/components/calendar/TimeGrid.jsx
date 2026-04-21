import React, { useEffect, useRef, useState, useMemo } from 'react';
import { format, isSameDay, differenceInMinutes, startOfDay, addMinutes, differenceInDays } from 'date-fns';
import EventCard from './EventCard';
import { computeEventPositions } from '../../utils/overlapUtils';
import { useCalendarStore } from '../../store/useCalendarStore';
import { DndContext, useDroppable, pointerWithin } from '@dnd-kit/core';

function DayColumn({ day, hours, handleGridClick, events, currentTime }) {
  const dayStr = format(day, 'yyyy-MM-dd');
  const isToday = isSameDay(day, new Date());
  
  const { setNodeRef } = useDroppable({
    id: `day-${dayStr}`,
    data: { day },
  });

  return (
    <div 
      ref={setNodeRef}
      className="flex-1 border-r border-google-border relative min-w-[120px]"
    >
      {/* Grid lines */}
      {hours.map(hour => (
        <div 
          key={hour} 
          onClick={() => handleGridClick(day, hour)}
          className="h-[60px] border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition" 
        />
      ))}

      {/* Render Events */}
      {events?.map(event => {
        const evtStart = new Date(event.start);
        const evtEnd = new Date(event.end);
        const top = differenceInMinutes(evtStart, startOfDay(day)); // 1 min = 1 px
        const height = Math.max(15, differenceInMinutes(evtEnd, evtStart));
        
        return (
          <EventCard 
            key={event.id}
            event={event}
            style={{
              top: `${top}px`,
              height: `${height}px`,
              left: `${event._left}%`,
              width: `calc(${event._width}% - 4px)`,
            }}
          />
        );
      })}

      {/* Current Time Indicator */}
      {isToday && (
        <div 
          className="absolute w-full flex items-center z-10"
          style={{ top: `${differenceInMinutes(currentTime, startOfDay(day))}px` }}
        >
          <div className="w-2.5 h-2.5 bg-google-red rounded-full -ml-1.5" />
          <div className="flex-1 h-0.5 bg-google-red" />
        </div>
      )}
    </div>
  );
}

export default function TimeGrid({ days, events }) {
  const containerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { updateEvent } = useCalendarStore();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const currentHour = currentTime.getHours();
      const scrollTo = Math.max(0, (currentHour - 2) * 60); 
      containerRef.current.scrollTop = scrollTo;
    }
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const positionedEventsPerDay = useMemo(() => {
    const dict = {};
    days.forEach(day => {
      const dayEvents = events.filter(e => isSameDay(new Date(e.start), day) && !e.allDay);
      dict[format(day, 'yyyy-MM-dd')] = computeEventPositions(dayEvents);
    });
    return dict;
  }, [days, events]);

  const handleGridClick = (day, hour) => {
    const newStart = new Date(day);
    newStart.setHours(hour, 0, 0, 0);
    const newEnd = new Date(day);
    newEnd.setHours(hour + 1, 0, 0, 0);

    window.dispatchEvent(new CustomEvent('openEventModal', { 
      detail: { start: newStart.toISOString(), end: newEnd.toISOString() } 
    }));
  };

  const handleDragEnd = (eventAction) => {
    const { active, over, delta } = eventAction;
    if (!over || !active.data.current) return;

    const event = active.data.current.event;
    // 1 pixel = 1 minute, snap to 15 mins
    const minutesDelta = Math.round(delta.y / 15) * 15;
    
    // Identify operation type
    if (active.id.toString().startsWith('resize-btm-')) {
      const newEnd = addMinutes(new Date(event.end), minutesDelta);
      if (newEnd > new Date(event.start)) { // prevent native negative events
        updateEvent(event.baseId || event.id, { end: newEnd.toISOString() });
      }
    } else if (active.id.toString().startsWith('resize-top-')) {
      const newStart = addMinutes(new Date(event.start), minutesDelta);
      if (newStart < new Date(event.end)) { 
        updateEvent(event.baseId || event.id, { start: newStart.toISOString() });
      }
    } else {
      // Body Drag (Move)
      const targetDay = over.data.current.day;
      const originalDay = startOfDay(new Date(event.start));
      const daysDelta = differenceInDays(targetDay, originalDay);

      const newStart = addDays(addMinutes(new Date(event.start), minutesDelta), daysDelta);
      const newEnd = addDays(addMinutes(new Date(event.end), minutesDelta), daysDelta);
      
      updateEvent(event.baseId || event.id, { 
        start: newStart.toISOString(),
        end: newEnd.toISOString()
      });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <div className="flex flex-1 h-full overflow-hidden flex-col bg-white select-none">
        <div className="flex border-b border-google-border ml-16 overflow-y-auto pr-4">
          {days.map(day => {
            const isToday = isSameDay(day, new Date());
            return (
              <div key={day.toISOString()} className="flex-1 flex flex-col items-center py-2 border-l border-google-border min-w-[120px]">
                <span className={`text-xs font-semibold ${isToday ? 'text-google-blue' : 'text-gray-500'}`}>
                  {format(day, 'EEE').toUpperCase()}
                </span>
                <span className={`text-2xl mt-1 w-10 h-10 flex items-center justify-center rounded-full ${isToday ? 'bg-google-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                  {format(day, 'd')}
                </span>
              </div>
            );
          })}
        </div>

        <div ref={containerRef} className="flex-1 overflow-y-auto relative no-scrollbar">
          <div className="flex">
            <div className="w-16 flex-shrink-0 border-r border-google-border text-xs text-gray-500 flex flex-col pt-3 pb-3">
              {hours.map(hour => (
                <div key={hour} className="h-[60px] relative">
                  <span className="absolute -top-2.5 right-2 bg-white px-1">
                    {hour === 0 ? '' : format(new Date().setHours(hour, 0), 'h a')}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-1 relative min-w-[120px]">
              {days.map(day => (
                <DayColumn 
                  key={format(day, 'yyyy-MM-dd')}
                  day={day}
                  hours={hours}
                  handleGridClick={handleGridClick}
                  currentTime={currentTime}
                  events={positionedEventsPerDay[format(day, 'yyyy-MM-dd')]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

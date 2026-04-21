import React from 'react';
import TimeGrid from './TimeGrid';
import { useCalendarStore } from '../../store/useCalendarStore';
import { expandRecurringEvents } from '../../utils/recurrenceUtils';
import { startOfDay, endOfDay } from 'date-fns';

export default function DayView() {
  const { currentDate, events } = useCalendarStore();
  const dateObj = new Date(currentDate);
  const days = [dateObj];
  
  const viewStart = startOfDay(dateObj);
  const viewEnd = endOfDay(dateObj);
  
  const visibleEvents = expandRecurringEvents(events, viewStart, viewEnd);

  return <TimeGrid days={days} events={visibleEvents} />;
}

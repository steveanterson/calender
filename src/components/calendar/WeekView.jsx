import React from 'react';
import TimeGrid from './TimeGrid';
import { useCalendarStore } from '../../store/useCalendarStore';
import { getWeekGridDays } from '../../utils/dateUtils';
import { expandRecurringEvents } from '../../utils/recurrenceUtils';
import { endOfWeek, startOfWeek } from 'date-fns';

export default function WeekView() {
  const { currentDate, events } = useCalendarStore();
  const dateObj = new Date(currentDate);
  const days = getWeekGridDays(dateObj);
  
  const viewStart = startOfWeek(dateObj);
  const viewEnd = endOfWeek(dateObj);
  
  const visibleEvents = expandRecurringEvents(events, viewStart, viewEnd);

  return <TimeGrid days={days} events={visibleEvents} />;
}

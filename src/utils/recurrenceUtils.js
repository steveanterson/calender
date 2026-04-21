import { addDays, addWeeks, addMonths, isBefore } from 'date-fns';

export const expandRecurringEvents = (events, viewStart, viewEnd) => {
  const allEvents = [];

  events.forEach((evt) => {
    if (!evt.recurrence) {
      allEvents.push(evt);
      return;
    }

    const { type, until } = evt.recurrence;
    let currentStart = new Date(evt.start);
    let currentEnd = new Date(evt.end);
    const limitDate = until ? new Date(until) : new Date(viewEnd.getTime() + 86400000 * 30); // 1 month beyond view

    let count = 0;
    while (!isBefore(limitDate, currentStart) && count < 365) {
      // Check if it fits the view
      if (currentStart >= viewStart && currentStart <= viewEnd) {
        allEvents.push({
          ...evt,
          id: `${evt.id}_${currentStart.getTime()}`,
          baseId: evt.id,
          start: currentStart.toISOString(),
          end: currentEnd.toISOString()
        });
      }

      if (type === 'daily') {
        currentStart = addDays(currentStart, 1);
        currentEnd = addDays(currentEnd, 1);
      } else if (type === 'weekly') {
        currentStart = addWeeks(currentStart, 1);
        currentEnd = addWeeks(currentEnd, 1);
      } else if (type === 'monthly') {
        currentStart = addMonths(currentStart, 1);
        currentEnd = addMonths(currentEnd, 1);
      } else {
        break; // safety
      }
      count++;
    }
  });

  return allEvents;
};

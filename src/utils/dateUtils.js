import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
} from 'date-fns';

export const getMonthGridDays = (date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: startDate, end: endDate });
};

export const getWeekGridDays = (date) => {
  const start = startOfWeek(date);
  const end = endOfWeek(date);
  return eachDayOfInterval({ start, end });
};

export const isCurrentMonth = (date, currentMonthDate) => {
  return isSameMonth(date, currentMonthDate);
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

export const getNextDate = (date, viewType) => {
  if (viewType === 'day') return addDays(date, 1);
  if (viewType === 'week') return addWeeks(date, 1);
  if (viewType === 'month') return addMonths(date, 1);
  return date;
};

export const getPrevDate = (date, viewType) => {
  if (viewType === 'day') return subDays(date, 1);
  if (viewType === 'week') return subWeeks(date, 1);
  if (viewType === 'month') return subMonths(date, 1);
  return date;
};

export const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

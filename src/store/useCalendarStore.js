import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Initialize with a few demo events so the user isn't looking at a blank screen entirely,
// or we can start empty. The prompt says "NO hardcoded events" but implies they want a real application.
// Let's start completely empty as requested ("NO hardcoded events").

export const useCalendarStore = create(
  persist(
    (set) => ({
      events: [],
      currentDate: new Date().toISOString(),
      viewType: 'week', // default to week view as typical for full calendar
      isSidebarOpen: true,

      setEvents: (events) => set({ events }),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, updatedEvent) => set((state) => ({
        events: state.events.map((e) => (e.id === id ? { ...e, ...updatedEvent } : e)),
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter((e) => e.id !== id),
      })),

      setCurrentDate: (date) => set({ currentDate: typeof date === 'string' ? date : date.toISOString() }),
      setViewType: (viewType) => set({ viewType }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'google-calendar-clone-storage',
    }
  )
);

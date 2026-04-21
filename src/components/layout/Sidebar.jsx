import React from 'react';
import { Plus } from 'lucide-react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { getMonthGridDays, isCurrentMonth, isToday } from '../../utils/dateUtils';
import { format } from 'date-fns';

export default function Sidebar() {
  const { isSidebarOpen, currentDate, setCurrentDate } = useCalendarStore();
  const dateObj = new Date(currentDate);
  const gridDays = getMonthGridDays(dateObj);

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-google-border h-full flex flex-col pt-4">
      <div className="px-4 mb-6">
        <button 
          className="flex items-center justify-center space-x-2 px-6 py-3 ml-2 bg-white border shadow-sm rounded-full hover:shadow-md transition duration-200"
          onClick={() => window.dispatchEvent(new CustomEvent('openEventModal'))}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full border bg-white">
            <Plus className="w-5 h-5 text-red-500" />
          </div>
          <span className="font-medium text-sm text-gray-600">Create</span>
        </button>
      </div>

      {/* Mini Calendar placeholder, real functionality is basic grid */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">{format(dateObj, 'MMMM yyyy')}</span>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
          {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {gridDays.map((date, idx) => {
            const isCurrMonth = isCurrentMonth(date, dateObj);
            const isTodayDate = isToday(date);
            const isSelected = format(date, 'yyyy-MM-dd') === format(dateObj, 'yyyy-MM-dd');

            return (
              <div 
                key={idx} 
                onClick={() => setCurrentDate(date.toISOString())}
                className={`w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition
                  ${!isCurrMonth ? 'text-gray-300' : 'text-gray-700'}
                  ${isSelected && !isTodayDate ? 'bg-blue-100 text-blue-800' : ''}
                  ${isTodayDate ? 'bg-google-blue text-white' : 'hover:bg-gray-100'}
                `}
              >
                {format(date, 'd')}
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 pt-4 border-t border-google-border flex-1">
        <h3 className="text-sm font-medium text-gray-600 mb-2">My calendars</h3>
        <label className="flex items-center space-x-3 cursor-pointer mt-2">
          <input type="checkbox" defaultChecked className="w-4 h-4 text-google-blue rounded border-gray-300 focus:ring-google-blue" />
          <span className="text-sm text-gray-700">Events</span>
        </label>
      </div>
    </aside>
  );
}

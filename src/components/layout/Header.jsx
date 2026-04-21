import React from 'react';
import { Menu, ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { getNextDate, getPrevDate } from '../../utils/dateUtils';
import { format } from 'date-fns';

export default function Header() {
  const { viewType, setViewType, currentDate, setCurrentDate, toggleSidebar } = useCalendarStore();

  const handlePrev = () => setCurrentDate(getPrevDate(new Date(currentDate), viewType));
  const handleNext = () => setCurrentDate(getNextDate(new Date(currentDate), viewType));
  const handleToday = () => setCurrentDate(new Date().toISOString());

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-google-border">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100 transition">
          <Menu className="w-6 h-6 text-google-text-gray" />
        </button>
        <div className="flex items-center">
          <span className="text-xl font-medium text-gray-700">Calendar</span>
        </div>
        
        <div className="flex items-center space-x-2 ml-8">
          <button onClick={handleToday} className="px-4 py-1.5 text-sm font-medium border border-google-border rounded hover:bg-gray-50 transition">
            Today
          </button>
          
          <div className="flex items-center space-x-1">
            <button onClick={handlePrev} className="p-1.5 rounded-full hover:bg-gray-100 transition">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={handleNext} className="p-1.5 rounded-full hover:bg-gray-100 transition">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <h2 className="text-xl font-normal text-gray-700 ml-4 min-w-[150px]">
             {format(new Date(currentDate), 'MMMM yyyy')}
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-gray-100 rounded-md px-3 py-1.5">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none outline-none text-sm w-32 focus:w-64 transition-all duration-300"
          />
        </div>

        <select 
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          className="border border-google-border rounded-md px-3 py-1.5 text-sm bg-white hover:bg-gray-50 cursor-pointer outline-none"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="agenda">Agenda</option>
        </select>
      </div>
    </header>
  );
}

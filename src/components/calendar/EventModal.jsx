import React, { useState, useEffect } from 'react';
import { X, Clock, AlignLeft, Calendar as CalendarIcon } from 'lucide-react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { v4 as uuidv4 } from 'uuid';
import { format, addHours, parseISO } from 'date-fns';

const COLORS = ['#1a73e8', '#d93025', '#e67c73', '#f6bf26', '#33b679', '#0b8043', '#039be5', '#3f51b5', '#7986cb', '#8e24aa', '#616161'];

export default function EventModal() {
  const { addEvent, updateEvent, deleteEvent } = useCalendarStore();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '', title: '', description: '',
    startDate: '', startTime: '', endDate: '', endTime: '',
    color: '#1a73e8', recurrenceType: '', untilDate: ''
  });

  useEffect(() => {
    const handleOpen = (e) => {
      const detail = e.detail || {};
      
      if (detail.event) {
        // Editing existing
        const startRaw = new Date(detail.event.start);
        const endRaw = new Date(detail.event.end);
        setFormData({
          ...detail.event,
          startDate: format(startRaw, 'yyyy-MM-dd'),
          startTime: format(startRaw, 'HH:mm'),
          endDate: format(endRaw, 'yyyy-MM-dd'),
          endTime: format(endRaw, 'HH:mm'),
          recurrenceType: detail.event.recurrence?.type || '',
          untilDate: detail.event.recurrence?.until ? format(new Date(detail.event.recurrence.until), 'yyyy-MM-dd') : ''
        });
      } else {
        // Create new
        const defaultStart = detail.start ? new Date(detail.start) : new Date();
        const defaultEnd = detail.end ? new Date(detail.end) : addHours(defaultStart, 1);
        setFormData({
          id: '', title: '', description: '', color: '#1a73e8',
          startDate: format(defaultStart, 'yyyy-MM-dd'),
          startTime: format(defaultStart, 'HH:mm'),
          endDate: format(defaultEnd, 'yyyy-MM-dd'),
          endTime: format(defaultEnd, 'HH:mm'),
          recurrenceType: '', untilDate: ''
        });
      }
      setIsOpen(true);
    };

    window.addEventListener('openEventModal', handleOpen);
    return () => window.removeEventListener('openEventModal', handleOpen);
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    const startIso = parseISO(`${formData.startDate}T${formData.startTime}:00`).toISOString();
    const endIso = parseISO(`${formData.endDate}T${formData.endTime}:00`).toISOString();
    
    // check validation
    if (new Date(endIso) <= new Date(startIso)) {
      alert("End time must be after start time");
      return;
    }

    const eventPayload = {
      id: formData.baseId || formData.id || uuidv4(),
      title: formData.title || '(No title)',
      description: formData.description,
      start: startIso,
      end: endIso,
      color: formData.color,
      allDay: false
    };

    if (formData.recurrenceType) {
      eventPayload.recurrence = {
        type: formData.recurrenceType,
        until: formData.untilDate ? parseISO(`${formData.untilDate}T23:59:59`).toISOString() : null
      };
    }

    if (formData.id && formData.baseId) {
      // It's an instance of recurring event. In a complex app we ask to update "this" vs "all".
      // For simplicity, we just update the base event.
      updateEvent(formData.baseId, eventPayload);
    } else if (formData.id) {
      updateEvent(formData.id, eventPayload);
    } else {
      addEvent(eventPayload);
    }
    
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent(formData.baseId || formData.id);
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
          <span className="text-gray-500 text-sm">{formData.id ? 'Edit Event' : 'New Event'}</span>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-200 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <input 
            autoFocus
            type="text" 
            placeholder="Add title" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full text-2xl border-b-2 border-transparent hover:border-gray-200 focus:border-google-blue focus:outline-none pb-1 transition-colors"
          />

          <div className="flex items-start space-x-4">
            <Clock className="w-5 h-5 text-gray-400 mt-1" />
            <div className="flex flex-col space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <input type="date" className="border rounded p-1 text-sm outline-none" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                <input type="time" className="border rounded p-1 text-sm outline-none" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                <span className="text-gray-500">-</span>
                <input type="time" className="border rounded p-1 text-sm outline-none" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                <input type="date" className="border rounded p-1 text-sm outline-none" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <select className="border rounded p-1 text-sm outline-none" value={formData.recurrenceType} onChange={e => setFormData({...formData, recurrenceType: e.target.value})}>
                  <option value="">Does not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                {formData.recurrenceType && (
                  <div className="flex items-center space-x-2 ml-2">
                    <span className="text-sm text-gray-500">until</span>
                    <input type="date" className="border rounded p-1 text-sm outline-none" value={formData.untilDate} onChange={e => setFormData({...formData, untilDate: e.target.value})} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <AlignLeft className="w-5 h-5 text-gray-400 mt-1" />
            <textarea 
              rows="3"
              placeholder="Add description"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-sm focus:bg-white focus:outline-none focus:border-google-blue flex-1 resize-none"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: formData.color }} />
            <div className="flex space-x-1 flex-1">
              {COLORS.map(c => (
                <button 
                  key={c}
                  onClick={() => setFormData({...formData, color: c})}
                  className={`w-5 h-5 rounded-full ${formData.color === c ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t flex justify-between">
          <div>
            {formData.id && (
              <button onClick={handleDelete} className="text-google-red text-sm font-medium hover:bg-red-50 px-3 py-1.5 rounded">
                Delete
              </button>
            )}
          </div>
          <button onClick={handleSave} className="bg-google-blue text-white px-6 py-1.5 rounded font-medium hover:bg-google-blue-dark shadow-sm">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react';
import { CalendarEvent } from '../types';
import { cn } from '../lib/utils';

export default function CalendarCard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');

  const fetchEvents = () => {
    fetch('/api/calendar')
      .then(res => res.json())
      .then(setEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const persistEvents = (updatedEvents: CalendarEvent[]) => {
    fetch('/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvents)
    });
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !newEventTitle.trim()) return;

    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEventTitle.trim(),
      date: selectedDay.toISOString(),
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    persistEvents(updatedEvents);
    setNewEventTitle('');
  };

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = events.filter(e => e.id !== id);
    setEvents(updatedEvents);
    persistEvents(updatedEvents);
  };

  const selectedDayEvents = selectedDay 
    ? events.filter(e => isSameDay(new Date(e.date), selectedDay))
    : [];

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm border border-black/5 rounded-2xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-900">Calendar</h2>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <span className="text-xs font-medium text-gray-700 min-w-[80px] text-center">
            {format(currentDate, 'MMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-7 gap-1 mb-2 shrink-0">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="text-[10px] font-bold text-gray-400 text-center uppercase">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4 shrink-0">
          {calendarDays.map((day, idx) => {
            const hasEvent = events.some(e => isSameDay(new Date(e.date), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDay && isSameDay(day, selectedDay);

            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition-all relative group",
                  !isCurrentMonth && "text-gray-300 opacity-50",
                  isCurrentMonth && "text-gray-600 hover:bg-indigo-50",
                  isToday && !isSelected && "bg-indigo-100 text-indigo-700 font-bold",
                  isSelected && "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-600 ring-offset-1"
                )}
              >
                <span>{format(day, 'd')}</span>
                {hasEvent && (
                  <div className={cn(
                    "absolute bottom-1 w-1 h-1 rounded-full",
                    isSelected ? "bg-white" : "bg-indigo-400"
                  )} />
                )}
              </button>
            );
          })}
        </div>

        {selectedDay && (
          <div className="shrink-0 flex flex-col bg-white border border-black/5 rounded-xl p-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                {format(selectedDay, 'EEEE, MMM d')}
              </span>
              <button onClick={() => setSelectedDay(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-3 h-3 text-gray-400" />
              </button>
            </div>

            <div className="space-y-2 mb-3">
              {selectedDayEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg group border border-transparent hover:border-slate-200 transition-all">
                  <span className="text-xs text-gray-700 truncate">{event.title}</span>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-all"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              ))}
              {selectedDayEvents.length === 0 && (
                <p className="text-[10px] text-gray-400 italic text-center py-2">No events scheduled.</p>
              )}
            </div>

            <form onSubmit={handleAddEvent} className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Add event..."
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-black/5 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button
                type="submit"
                disabled={!newEventTitle.trim()}
                className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

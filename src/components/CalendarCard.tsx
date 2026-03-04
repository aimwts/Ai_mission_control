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
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent } from '../types';
import { cn } from '../lib/utils';

export default function CalendarCard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetch('/api/calendar')
      .then(res => res.json())
      .then(setEvents);
  }, []);

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

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm border border-black/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-900">Calendar</h2>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={idx} className="text-[10px] font-bold text-gray-400 text-center uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1">
        {calendarDays.map((day, idx) => {
          const hasEvent = events.some(e => isSameDay(new Date(e.date), day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={idx}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition-all relative group cursor-default",
                !isCurrentMonth && "text-gray-300",
                isCurrentMonth && "text-gray-600 hover:bg-indigo-50",
                isToday && "bg-indigo-600 text-white hover:bg-indigo-700"
              )}
            >
              <span>{format(day, 'd')}</span>
              {hasEvent && (
                <div className={cn(
                  "absolute bottom-1 w-1 h-1 rounded-full",
                  isToday ? "bg-white" : "bg-indigo-400"
                )} />
              )}
              
              {hasEvent && (
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 w-32 bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl">
                  {events.filter(e => isSameDay(new Date(e.date), day)).map(e => (
                    <div key={e.id} className="truncate">• {e.title}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Task, Event } from '../types';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, MapPin, Calendar } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  events: Event[];
  onEventClick?: (event: Event) => void;
  onTaskClick?: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, events, onEventClick, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getDayItems = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    const dayEvents = events.filter(e => {
      const start = new Date(e.date);
      const end = new Date(e.endDate);
      const current = new Date(dateStr);
      return current >= start && current <= end;
    });
    
    return { tasks: dayTasks, events: dayEvents };
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="p-2 min-h-[100px]" />);
  }

  for (let day = 1; day <= totalDays; day++) {
    const { tasks: dayTasks, events: dayEvents } = getDayItems(day);
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

    days.push(
      <div 
        key={day} 
        className={`p-2 min-h-[100px] border border-border/50 rounded-lg ${isToday ? 'bg-accent' : 'bg-card'}`}
      >
        <div className={`text-sm font-bold mb-2 ${isToday ? 'text-primary' : 'text-foreground'}`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 2).map(event => (
            <div 
              key={event.id}
              onClick={() => onEventClick && onEventClick(event)}
              className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded truncate cursor-pointer hover:bg-blue-100"
            >
              <Calendar size={8} className="inline mr-1" />
              {event.title}
            </div>
          ))}
          {dayTasks.slice(0, 2).map(task => (
            <div 
              key={task.id}
              onClick={() => onTaskClick && onTaskClick(task)}
              className={`text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer ${
                task.status === 'done' 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              <CheckCircle2 size={8} className="inline mr-1" />
              {task.title}
            </div>
          ))}
          {(dayEvents.length + dayTasks.length > 4) && (
            <div className="text-[10px] text-muted-foreground font-medium">
              +{dayEvents.length + dayTasks.length - 4} more
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-bold text-muted-foreground uppercase py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    </div>
  );
};

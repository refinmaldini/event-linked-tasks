import React from 'react';
import { Event, User, EventTypeConfig } from '../types';
import { MapPin, Users, Clock, Plus, CalendarDays, Briefcase } from 'lucide-react';

interface EventListViewProps {
  events: Event[];
  users: User[];
  eventTypes: EventTypeConfig[];
  onAddEvent: () => void;
  onEventClick: (event: Event) => void;
}

const THEME_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  lime: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  fuchsia: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export const EventListView: React.FC<EventListViewProps> = ({ 
  events, 
  users, 
  eventTypes, 
  onAddEvent, 
  onEventClick 
}) => {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const getEventTypeStyle = (typeId: string) => {
    const type = eventTypes.find(t => t.id === typeId);
    const theme = type?.theme || 'slate';
    return THEME_STYLES[theme] || THEME_STYLES.slate;
  };

  const getUser = (id: string) => users.find(u => u.id === id);

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    
    if (start === end) {
      return startDate.toLocaleDateString('en-US', opts);
    }
    return `${startDate.toLocaleDateString('en-US', opts)} - ${endDate.toLocaleDateString('en-US', opts)}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sortedEvents.map(event => {
          const typeConfig = eventTypes.find(t => t.id === event.type);
          const style = getEventTypeStyle(event.type);
          
          return (
            <div 
              key={event.id}
              onClick={() => onEventClick(event)}
              className={`bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border overflow-hidden cursor-pointer hover:shadow-lg transition-all group`}
            >
              {/* Header with date */}
              <div className={`${style.bg} ${style.border} border-b p-3 sm:p-4`}>
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className={`text-[10px] sm:text-xs font-bold uppercase ${style.text} px-1.5 sm:px-2 py-0.5 rounded-full ${style.bg} border ${style.border}`}>
                    {typeConfig?.label || event.type}
                  </span>
                  <CalendarDays size={14} className={`sm:w-4 sm:h-4 ${style.text}`} />
                </div>
                <p className={`text-sm sm:text-lg font-bold ${style.text}`}>
                  {formatDateRange(event.date, event.endDate)}
                </p>
              </div>

              {/* Body */}
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-foreground text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {event.title}
                </h3>
                
                {event.clientName && (
                  <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-1.5 sm:mb-2">
                    <Briefcase size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                    <span className="truncate">{event.clientName}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">
                  <Clock size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  {event.startTime} - {event.endTime}
                </div>
                
                {event.location && (
                  <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">
                    <MapPin size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                
                {/* Attendees */}
                {event.attendees && event.attendees.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 sm:pt-3 border-t border-border">
                    <Users size={12} className="sm:w-3.5 sm:h-3.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex -space-x-2">
                      {event.attendees.slice(0, 4).map(id => {
                        const user = getUser(id);
                        return user ? (
                          <img 
                            key={id}
                            src={user.avatar} 
                            alt={user.name}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-card"
                          />
                        ) : null;
                      })}
                      {event.attendees.length > 4 && (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-muted text-muted-foreground text-[9px] sm:text-[10px] font-bold flex items-center justify-center border-2 border-card">
                          +{event.attendees.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        <button 
          onClick={onAddEvent}
          className="border-2 border-dashed border-border rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all min-h-[200px] sm:min-h-[300px]"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-accent">
            <Plus size={20} className="sm:w-6 sm:h-6" />
          </div>
          <span className="font-bold text-sm sm:text-base">Schedule Event</span>
        </button>
      </div>
    </div>
  );
};

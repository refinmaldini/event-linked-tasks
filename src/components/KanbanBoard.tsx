import React, { useState } from 'react';
import { Task, User, TaskStatus, KanbanColumn, Event } from '../types';
import { Calendar, Plus, CheckSquare, Flag, AlertCircle, Clock, X, MapPin, Users, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KanbanBoardProps {
  tasks: Task[];
  users: User[];
  columns: KanbanColumn[];
  events: Event[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onEventClick?: (event: Event) => void;
}

const THEME_STYLES: Record<string, { bg: string; text: string }> = {
  slate: { bg: 'bg-slate-100', text: 'text-slate-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  lime: { bg: 'bg-lime-50', text: 'text-lime-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  fuchsia: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
  default: { bg: 'bg-slate-100', text: 'text-slate-600' }
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  tasks, 
  users, 
  columns,
  events,
  onStatusChange, 
  onAddTask, 
  onTaskClick,
  onEventClick
}) => {
  const [previewEvent, setPreviewEvent] = useState<Event | null>(null);
  
  const getTasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);
  const getUser = (id: string) => users.find((u) => u.id === id);
  const getEventByName = (eventName: string) => events.find((e) => e.title === eventName);

  const handleEventBadgeClick = (e: React.MouseEvent, eventName: string) => {
    e.stopPropagation();
    const event = getEventByName(eventName);
    if (event) {
      setPreviewEvent(event);
    }
  };

  const formatEventDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-slate-300';
    }
  };

  const getDueDateStatus = (dateStr: string, isDone: boolean) => {
    if (isDone) return { color: 'text-muted-foreground', icon: Calendar };
    
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    if (due < today) return { color: 'text-red-500 font-bold', icon: AlertCircle, label: 'Overdue' };
    if (due.getTime() === today.getTime()) return { color: 'text-orange-500 font-bold', icon: Clock, label: 'Today' };
    
    return { color: 'text-muted-foreground', icon: Calendar };
  };

  const getColumnTitle = (col: KanbanColumn) => {
    if (col.id === 'todo') return 'TODO';
    if (col.id === 'in-progress') return 'IN PROGRESS';
    if (col.id === 'done') return 'DONE';
    return col.title;
  };
  
  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4 snap-x">
      {columns.map((col) => {
        const theme = THEME_STYLES[col.theme] || THEME_STYLES.default;
        const columnTasks = getTasksByStatus(col.id);
        
        return (
          <div
            key={col.id}
            className="flex flex-col h-full min-w-[300px] flex-1 snap-center"
            onDrop={(e) => handleDrop(e, col.id)}
            onDragOver={handleDragOver}
          >
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4 bg-card p-3 rounded-xl border border-border shadow-sm z-10 relative">
              <h3 className={`font-bold uppercase text-sm ${theme.text}`}>
                {getColumnTitle(col)}
              </h3>
              <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-bold">
                {columnTasks.length}
              </span>
            </div>

            {/* Tasks Container */}
            <div className={`flex-1 space-y-3 rounded-xl p-2 border relative transition-colors ${theme.bg} border-border/50`}>
              {/* Add Task Button for this column */}
              <button 
                onClick={() => onAddTask(col.id)}
                className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm font-medium mb-3 bg-card/50"
              >
                <Plus size={16} /> Add Task
              </button>

              <AnimatePresence mode='popLayout'>
                {columnTasks.map((task) => {
                  const assignee = getUser(task.assigneeId);
                  const subtasks = task.subtasks || [];
                  const completedSubtasks = subtasks.filter(s => s.isCompleted).length;
                  const progress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;
                  const dueStatus = getDueDateStatus(task.dueDate, task.status === 'done');
                  const DueIcon = dueStatus.icon;

                  return (
                    <motion.div
                      key={task.id}
                      layout
                      layoutId={task.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task.id)}
                      onClick={() => onTaskClick(task)}
                      className="bg-card p-4 rounded-xl shadow-sm border border-border cursor-pointer hover:shadow-md group relative overflow-hidden"
                    >
                      {/* Priority Strip */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityColor(task.priority)}`} />

                      <div className="flex justify-between items-start mb-2 pl-2">
                        <div className="flex gap-2">
                          {task.priority === 'high' && <Flag size={12} className="text-red-500 mt-1" fill="currentColor" />}
                          <h4 className="font-semibold text-foreground line-clamp-2 text-sm">{task.title}</h4>
                        </div>
                      </div>
                      
                      {/* Event Badge */}
                      {task.eventName && (
                        <div className="mb-2 pl-2">
                          <button
                            onClick={(e) => handleEventBadgeClick(e, task.eventName!)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-[10px] font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Calendar size={10} />
                            {task.eventName}
                          </button>
                        </div>
                      )}
                      
                      <p className="text-muted-foreground text-xs mb-3 line-clamp-2 pl-2">{task.description}</p>
                      
                      {/* Subtask Progress */}
                      {subtasks.length > 0 && (
                        <div className="mb-3 pl-2">
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                            <CheckSquare size={10} />
                            <span>{completedSubtasks}/{subtasks.length}</span>
                          </div>
                          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-border/50 pl-2">
                        <div className="flex items-center gap-2">
                          {assignee && (
                            <div className="flex items-center gap-1.5 pr-2">
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-5 h-5 rounded-full"
                              />
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center text-xs ${dueStatus.color}`}>
                          <DueIcon size={12} className="mr-1" />
                          {dueStatus.label ? dueStatus.label : new Date(task.dueDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {columnTasks.length === 0 && (
                <div className="h-32 flex flex-col items-center justify-center text-muted-foreground/50 text-sm">
                  <p>Drop tasks here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Event Preview Modal */}
      <AnimatePresence>
        {previewEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-border"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                      {previewEvent.type}
                    </span>
                    <h3 className="text-lg font-bold mt-2">{previewEvent.title}</h3>
                    {previewEvent.clientName && (
                      <p className="text-sm opacity-90">{previewEvent.clientName}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setPreviewEvent(null)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CalendarDays size={16} className="text-muted-foreground" />
                  <span>{formatEventDate(previewEvent.date)}</span>
                </div>
                
                {previewEvent.startTime && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={16} className="text-muted-foreground" />
                    <span>{previewEvent.startTime}{previewEvent.endTime ? ` - ${previewEvent.endTime}` : ''}</span>
                  </div>
                )}
                
                {previewEvent.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span>{previewEvent.location}</span>
                  </div>
                )}
                
                {previewEvent.attendees && previewEvent.attendees.length > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <Users size={16} className="text-muted-foreground" />
                    <span>{previewEvent.attendees.length} attendee(s)</span>
                  </div>
                )}

                {previewEvent.description && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground">{previewEvent.description}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border flex gap-2">
                <button
                  onClick={() => setPreviewEvent(null)}
                  className="flex-1 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Tutup
                </button>
                {onEventClick && (
                  <button
                    onClick={() => {
                      onEventClick(previewEvent);
                      setPreviewEvent(null);
                    }}
                    className="flex-1 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Edit Event
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

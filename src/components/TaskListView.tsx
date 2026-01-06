import React from 'react';
import { Task, User, TaskStatus, KanbanColumn } from '../types';
import { Search, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';

interface TaskListViewProps {
  tasks: Task[];
  users: User[];
  columns: KanbanColumn[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick?: (task: Task) => void;
}

const THEME_STYLES: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  slate: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', ring: 'focus:ring-slate-500' },
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', ring: 'focus:ring-red-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', ring: 'focus:ring-orange-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', ring: 'focus:ring-amber-500' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', ring: 'focus:ring-yellow-500' },
  lime: { bg: 'bg-lime-50', text: 'text-lime-600', border: 'border-lime-200', ring: 'focus:ring-lime-500' },
  green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', ring: 'focus:ring-green-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', ring: 'focus:ring-emerald-500' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', ring: 'focus:ring-teal-500' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', ring: 'focus:ring-cyan-500' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', ring: 'focus:ring-sky-500' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', ring: 'focus:ring-blue-500' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', ring: 'focus:ring-indigo-500' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', ring: 'focus:ring-violet-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', ring: 'focus:ring-purple-500' },
  fuchsia: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', border: 'border-fuchsia-200', ring: 'focus:ring-fuchsia-500' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', ring: 'focus:ring-pink-500' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', ring: 'focus:ring-rose-500' },
};

export const TaskListView: React.FC<TaskListViewProps> = ({ 
  tasks, 
  users, 
  columns, 
  onStatusChange, 
  onTaskClick 
}) => {
  const [filter, setFilter] = React.useState('');
  
  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()));

  const getUser = (id: string) => users.find(u => u.id === id);

  const getStatusConfig = (statusId: string) => {
    const col = columns.find(c => c.id === statusId);
    if (!col) return { title: statusId, ...THEME_STYLES.slate };
    const styles = THEME_STYLES[col.theme] || THEME_STYLES.slate;
    
    let displayTitle = col.title;
    if (col.id === 'todo') displayTitle = 'TODO';
    if (col.id === 'in-progress') displayTitle = 'IN PROGRESS';
    if (col.id === 'done') displayTitle = 'DONE';

    return { title: displayTitle, ...styles };
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-card">
        <h3 className="font-bold text-lg text-foreground">All Tasks</h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* List Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-muted text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
        <div className="col-span-5">Task Details</div>
        <div className="col-span-2">Event</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-3 text-right">Assignee</div>
      </div>

      {/* List Body */}
      <div className="divide-y divide-border">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No tasks found.</div>
        ) : (
          filteredTasks.map(task => {
            const assignee = getUser(task.assigneeId);
            const statusConfig = getStatusConfig(task.status);
            
            return (
              <div 
                key={task.id} 
                onClick={() => onTaskClick && onTaskClick(task)}
                className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 hover:bg-muted/50 transition-colors md:items-center group cursor-pointer relative"
              >
                <div className="md:col-span-5 flex items-start gap-3">
                  <div className={`mt-1 md:mt-0 ${task.status === 'done' ? 'text-emerald-500' : 'text-muted-foreground/30'}`}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className={`font-medium text-foreground ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground text-xs">
                      <Calendar size={12} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {/* Event Column */}
                <div className="md:col-span-2">
                  {task.eventName && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium">
                      <Calendar size={10} />
                      {task.eventName}
                    </span>
                  )}
                </div>
                
                {/* Status Dropdown */}
                <div className="md:col-span-2 flex justify-start md:justify-center pl-8 md:pl-0">
                  <div className="relative group" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value)}
                      className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border cursor-pointer transition-all outline-none focus:ring-2 focus:ring-offset-1 uppercase
                        ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} ${statusConfig.ring}
                      `}
                    >
                      {columns.map(col => {
                        let title = col.title;
                        if (col.id === 'todo') title = 'TODO';
                        if (col.id === 'in-progress') title = 'IN PROGRESS';
                        if (col.id === 'done') title = 'DONE';
                        
                        return (
                          <option key={col.id} value={col.id}>
                            {title.toUpperCase()}
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${statusConfig.text} opacity-50`} />
                  </div>
                </div>

                <div className="md:col-span-3 flex justify-end pl-8 md:pl-0">
                  {assignee ? (
                    <div className="flex items-center gap-2 text-right">
                      <div className="block">
                        <p className="text-sm font-medium text-foreground">{assignee.name}</p>
                        <p className="text-xs text-muted-foreground hidden sm:block">{assignee.role}</p>
                      </div>
                      <img src={assignee.avatar} alt={assignee.name} className="w-8 h-8 rounded-full border border-border" />
                    </div>
                  ) : <span className="text-muted-foreground text-sm">Unassigned</span>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

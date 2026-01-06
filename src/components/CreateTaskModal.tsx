import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { User, TaskStatus, Task, Event, KanbanColumn } from '../types';
import { FileText, Calendar, Activity, Flag, Trash2, X, AlertTriangle, Link as LinkIcon } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User;
  events: Event[];
  columns?: KanbanColumn[];
  onSave: (task: Omit<Task, 'id' | 'teamId'>) => void;
  onDelete?: (taskId: string) => void;
  initialStatus?: TaskStatus;
  taskToEdit?: Task | null;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  users, 
  currentUser, 
  events, 
  columns = [], 
  onSave, 
  onDelete, 
  initialStatus = 'todo', 
  taskToEdit 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventId: '',
    eventName: '',
    duration: '',
    assigneeId: '',
    assetLink: '',
    projectLink: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: initialStatus,
  });

  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [eventError, setEventError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsDeleteConfirm(false);
      setEventError('');
      if (taskToEdit) {
        setFormData({
          title: taskToEdit.title,
          description: taskToEdit.description,
          eventId: taskToEdit.eventId || '',
          eventName: taskToEdit.eventName || '',
          duration: taskToEdit.duration || '',
          assigneeId: taskToEdit.assigneeId,
          assetLink: taskToEdit.assetLink || '',
          projectLink: taskToEdit.projectLink || '',
          dueDate: taskToEdit.dueDate,
          priority: taskToEdit.priority,
          status: taskToEdit.status,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          eventId: '',
          eventName: '',
          duration: '',
          assigneeId: users[0]?.id || '',
          assetLink: '',
          projectLink: '',
          dueDate: new Date().toISOString().split('T')[0],
          priority: 'medium',
          status: initialStatus,
        });
      }
    }
  }, [isOpen, taskToEdit, users, initialStatus]);

  const handleEventChange = (eventId: string) => {
    const selectedEvent = events.find(e => e.id === eventId);
    setFormData({
      ...formData,
      eventId,
      eventName: selectedEvent?.title || '',
    });
    setEventError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate event selection - MANDATORY
    if (!formData.eventId) {
      setEventError('⚠️ You must select an Event for this task!');
      return;
    }
    
    onSave({ ...formData, subtasks: taskToEdit?.subtasks || [] });
    onClose();
  };

  const isUrl = (str: string) => {
    if (!str) return false;
    return str.includes('.') && (str.startsWith('http') || str.length > 5);
  };

  const formatUrl = (str: string) => str.startsWith('http') ? str : `https://${str}`;

  const getStatusLabel = (colId: string, colTitle: string) => {
    if (colId === 'todo') return 'TODO';
    if (colId === 'in-progress') return 'IN PROGRESS';
    if (colId === 'done') return 'DONE';
    return colTitle;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={taskToEdit ? 'Edit Task' : 'Create New Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Selection - REQUIRED - PROMINENT */}
        <div className={`p-4 rounded-xl border-2 ${eventError ? 'border-red-400 bg-red-50' : 'border-primary/30 bg-accent'}`}>
          <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            Select Event <span className="text-red-500">*</span>
            <span className="text-xs font-normal text-muted-foreground">(Required)</span>
          </label>
          
          {events.length === 0 ? (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              <AlertTriangle size={16} />
              <span>No events available. Please create an event first before adding tasks.</span>
            </div>
          ) : (
            <select 
              required
              className={`w-full px-4 py-3 bg-card border rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary ${eventError ? 'border-red-400' : 'border-border'}`}
              value={formData.eventId} 
              onChange={e => handleEventChange(e.target.value)}
            >
              <option value="">-- Choose an Event --</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  📅 {event.title} ({new Date(event.date).toLocaleDateString()})
                </option>
              ))}
            </select>
          )}
          
          {eventError && (
            <p className="text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
              <AlertTriangle size={14} />
              {eventError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-1">Task Name</label>
          <input 
            required 
            type="text" 
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary" 
            placeholder="e.g. Design Banner" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-1">Description</label>
          <textarea 
            rows={2} 
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary" 
            placeholder="..." 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Assigned To</label>
            <select 
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary" 
              value={formData.assigneeId} 
              onChange={e => setFormData({...formData, assigneeId: e.target.value})}
            >
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Due Date</label>
            <input 
              type="date" 
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary" 
              value={formData.dueDate} 
              onChange={e => setFormData({...formData, dueDate: e.target.value})} 
            />
          </div>
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Status</label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <select 
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary uppercase" 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                {columns.map(col => (
                  <option key={col.id} value={col.id}>{getStatusLabel(col.id, col.title)}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Priority</label>
            <div className="relative">
              <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <select 
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary capitalize" 
                value={formData.priority} 
                onChange={e => setFormData({...formData, priority: e.target.value as any})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="space-y-3 pt-2 border-t border-border">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Links (Optional)</h4>
          <div className="relative">
            <FileText className="absolute left-3 top-2.5 text-muted-foreground" size={14} />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-xs focus:ring-1 focus:ring-primary" 
              placeholder="Asset Link (Drive/Dropbox)" 
              value={formData.assetLink} 
              onChange={e => setFormData({...formData, assetLink: e.target.value})} 
            />
            {isUrl(formData.assetLink) && (
              <a 
                href={formatUrl(formData.assetLink)} 
                target="_blank" 
                rel="noreferrer" 
                className="absolute right-3 top-2.5 text-[10px] font-bold text-primary hover:underline flex items-center gap-1 bg-accent px-2 py-0.5 rounded transition-all"
              >
                OPEN ↗
              </a>
            )}
          </div>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-2.5 text-muted-foreground" size={14} />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-xs focus:ring-1 focus:ring-primary" 
              placeholder="Project Link (Canva/Capcut)" 
              value={formData.projectLink} 
              onChange={e => setFormData({...formData, projectLink: e.target.value})} 
            />
            {isUrl(formData.projectLink) && (
              <a 
                href={formatUrl(formData.projectLink)} 
                target="_blank" 
                rel="noreferrer" 
                className="absolute right-3 top-2.5 text-[10px] font-bold text-primary hover:underline flex items-center gap-1 bg-accent px-2 py-0.5 rounded transition-all"
              >
                OPEN ↗
              </a>
            )}
          </div>
        </div>

        <div className="pt-6 flex justify-between items-center border-t border-border">
          {taskToEdit && onDelete ? (
            isDeleteConfirm ? (
              <div className="flex items-center gap-2 animate-in">
                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); onDelete(taskToEdit.id); }} 
                  className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold shadow-md transition-all"
                >
                  <Trash2 size={16} /> Confirm
                </button>
                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); setIsDeleteConfirm(false); }}
                  className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); setIsDeleteConfirm(true); }} 
                className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold border border-red-100 transition-all"
              >
                <Trash2 size={16} /> Delete
              </button>
            )
          ) : <div />}
          
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-muted-foreground text-sm font-bold hover:bg-muted rounded-lg transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={events.length === 0}
              className="px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {taskToEdit ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

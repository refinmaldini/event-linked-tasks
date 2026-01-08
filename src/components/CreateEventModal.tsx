import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { User, Event, EventTypeConfig } from '../types';
import { MapPin, Briefcase, Trash2, ExternalLink, X } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onSave: (event: Omit<Event, 'id' | 'teamId'>) => void;
  onDelete?: (eventId: string) => void;
  eventToEdit?: Event | null;
  eventTypes: EventTypeConfig[];
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ 
  isOpen, 
  onClose, 
  users, 
  onSave, 
  onDelete, 
  eventToEdit, 
  eventTypes 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: eventTypes[0]?.id || '',
    clientName: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    attendees: [] as string[],
  });
  
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDeleteConfirm(false);
      if (eventToEdit) {
        setFormData({
          title: eventToEdit.title,
          description: eventToEdit.description,
          type: eventToEdit.type,
          clientName: eventToEdit.clientName || '',
          location: eventToEdit.location || '',
          date: eventToEdit.date,
          endDate: eventToEdit.endDate || eventToEdit.date,
          startTime: eventToEdit.startTime,
          endTime: eventToEdit.endTime,
          attendees: eventToEdit.attendees,
        });
      } else {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          title: '',
          description: '',
          type: eventTypes[0]?.id || '',
          clientName: '',
          location: '',
          date: today,
          endDate: today,
          startTime: '09:00',
          endTime: '10:00',
          attendees: [users[0]?.id || '']
        });
      }
    }
  }, [isOpen, eventToEdit, users, eventTypes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const isUrl = (str: string) => {
    if (!str) return false;
    return str.includes('.') && (str.startsWith('http') || str.length > 5);
  };

  const formatUrl = (str: string) => str.startsWith('http') ? str : `https://${str}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={eventToEdit ? 'Edit Event' : 'Schedule Event'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-foreground mb-1">Event Name</label>
          <input 
            required 
            type="text" 
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary" 
            placeholder="e.g. Workshop" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Event Type</label>
            <select 
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary" 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              {eventTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Client Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm" 
              placeholder="PT..." 
              value={formData.clientName} 
              onChange={e => setFormData({...formData, clientName: e.target.value})} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 bg-accent rounded-xl border border-primary/20">
          <div>
            <label className="block text-[10px] font-bold text-primary uppercase mb-1">Start Date</label>
            <input 
              required 
              type="date" 
              className="w-full px-3 py-1.5 bg-card border border-primary/20 rounded-lg text-sm focus:ring-2 focus:ring-primary" 
              value={formData.date} 
              onChange={e => {
                const newStartDate = e.target.value;
                const newEndDate = new Date(formData.endDate) < new Date(newStartDate) ? newStartDate : formData.endDate;
                setFormData({...formData, date: newStartDate, endDate: newEndDate});
              }} 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-primary uppercase mb-1">End Date</label>
            <input 
              required 
              type="date" 
              min={formData.date}
              className="w-full px-3 py-1.5 bg-card border border-primary/20 rounded-lg text-sm focus:ring-2 focus:ring-primary" 
              value={formData.endDate} 
              onChange={e => setFormData({...formData, endDate: e.target.value})} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Start Time</label>
            <input 
              type="time" 
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary" 
              value={formData.startTime} 
              onChange={e => setFormData({...formData, startTime: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">End Time</label>
            <input 
              type="time" 
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary" 
              value={formData.endTime} 
              onChange={e => setFormData({...formData, endTime: e.target.value})} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-1">Location / Meeting Link</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm" 
              placeholder="e.g. Meeting Room A or https://meet.google.com/..." 
              value={formData.location} 
              onChange={e => setFormData({...formData, location: e.target.value})} 
            />
            {isUrl(formData.location) && (
              <a 
                href={formatUrl(formData.location)} 
                target="_blank" 
                rel="noreferrer" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-1">Description</label>
          <textarea 
            rows={2} 
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm" 
            placeholder="Event details..." 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </div>

        <div className="pt-4 sm:pt-6 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 border-t border-border">
          {eventToEdit && onDelete ? (
            isDeleteConfirm ? (
              <div className="flex items-center gap-2 animate-in">
                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); onDelete(eventToEdit.id); }} 
                  className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold shadow-md transition-all flex-1 sm:flex-none"
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
                className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold border border-red-100 transition-all"
              >
                <Trash2 size={16} /> Delete
              </button>
            )
          ) : <div className="hidden sm:block" />}
          
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 sm:flex-none px-4 py-2 text-muted-foreground text-sm font-bold hover:bg-muted rounded-lg transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 sm:flex-none px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg shadow-lg hover:opacity-90 transition-all"
            >
              {eventToEdit ? 'Save Changes' : 'Add Event'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

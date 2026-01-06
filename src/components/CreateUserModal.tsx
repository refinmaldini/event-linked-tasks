import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { User } from '../types';
import { Mail, User as UserIcon, Shield, Link, Key } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id'>) => void;
  userToEdit?: User | null;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSave, userToEdit }) => {
  const defaultFormState = {
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'Member' as 'Owner' | 'Member' | 'Guest',
    avatar: '',
  };

  const [formData, setFormData] = useState(defaultFormState);

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setFormData({
          name: userToEdit.name,
          email: userToEdit.email,
          username: userToEdit.username || '',
          password: userToEdit.password || '',
          role: userToEdit.role,
          avatar: userToEdit.avatar,
        });
      } else {
        setFormData({
          ...defaultFormState,
          avatar: `https://ui-avatars.com/api/?name=New+User&background=random&color=fff&size=128`
        });
      }
    }
  }, [isOpen, userToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalAvatar = formData.avatar;
    if (formData.avatar.includes('New+User') && formData.name) {
      finalAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff&size=128`;
    }
    
    const finalData = {
      ...formData,
      avatar: finalAvatar,
      username: formData.username || formData.name.toLowerCase().replace(/\s/g, ''),
      password: formData.password || '123'
    };

    onSave(finalData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={userToEdit ? "Edit Team Member" : "Add Team Member"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Preview Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <img 
              src={formData.avatar || 'https://via.placeholder.com/100'} 
              alt="Preview" 
              className="w-24 h-24 rounded-full border-4 border-border object-cover shadow-sm"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold">Preview</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-1">Full Name</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              required
              type="text" 
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Sarah Miller"
              value={formData.name}
              onChange={e => {
                setFormData({
                  ...formData, 
                  name: e.target.value,
                  avatar: formData.avatar.includes('ui-avatars.com') 
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(e.target.value || 'New User')}&background=random&color=fff&size=128`
                    : formData.avatar
                });
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              required
              type="email" 
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. sarah@company.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="user123"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Secret"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <select 
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as any})}
              >
                <option value="Member">Member</option>
                <option value="Owner">Owner</option>
                <option value="Guest">Guest</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Avatar URL</label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="https://..."
                value={formData.avatar}
                onChange={e => setFormData({...formData, avatar: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2 border-t border-border mt-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-muted-foreground font-medium hover:bg-muted rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-all shadow-lg"
          >
            {userToEdit ? "Save Changes" : "Add Member"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

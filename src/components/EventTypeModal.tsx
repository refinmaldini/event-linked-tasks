import React, { useState } from 'react';
import { X, Plus, Trash2, Palette } from 'lucide-react';
import { EventTypeConfig, ColorTheme } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const THEME_COLORS: { id: ColorTheme; label: string; bg: string; text: string }[] = [
  { id: 'slate', label: 'Slate', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
  { id: 'red', label: 'Red', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
  { id: 'orange', label: 'Orange', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  { id: 'yellow', label: 'Yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
  { id: 'lime', label: 'Lime', bg: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-700 dark:text-lime-300' },
  { id: 'green', label: 'Green', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
  { id: 'teal', label: 'Teal', bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300' },
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300' },
  { id: 'sky', label: 'Sky', bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-300' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300' },
  { id: 'violet', label: 'Violet', bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  { id: 'fuchsia', label: 'Fuchsia', bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', text: 'text-fuchsia-700 dark:text-fuchsia-300' },
  { id: 'pink', label: 'Pink', bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300' },
];

interface EventTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTypes: EventTypeConfig[];
  onSave: (eventTypes: EventTypeConfig[]) => void;
}

export const EventTypeModal: React.FC<EventTypeModalProps> = ({
  isOpen,
  onClose,
  eventTypes,
  onSave,
}) => {
  const { t } = useLanguage();
  const [types, setTypes] = useState<EventTypeConfig[]>(eventTypes);
  const [newLabel, setNewLabel] = useState('');
  const [newTheme, setNewTheme] = useState<ColorTheme>('blue');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const handleAddType = () => {
    if (!newLabel.trim()) return;
    const id = newLabel.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    setTypes([...types, { id, label: newLabel.trim(), theme: newTheme }]);
    setNewLabel('');
    setNewTheme('blue');
  };

  const handleDeleteType = (id: string) => {
    setTypes(types.filter(t => t.id !== id));
  };

  const handleChangeTheme = (id: string, theme: ColorTheme) => {
    setTypes(types.map(t => t.id === id ? { ...t, theme } : t));
    setShowColorPicker(null);
  };

  const handleSave = () => {
    onSave(types);
    onClose();
  };

  const getThemeStyle = (theme: ColorTheme) => {
    return THEME_COLORS.find(c => c.id === theme) || THEME_COLORS[0];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">{t('eventTypes')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {/* Add New Type */}
            <div className="mb-4 p-3 bg-muted/50 rounded-xl">
              <label className="text-sm font-medium text-foreground mb-2 block">{t('addEventType')}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  placeholder={t('typeName')}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={e => e.key === 'Enter' && handleAddType()}
                />
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(showColorPicker === 'new' ? null : 'new')}
                    className={`p-2 rounded-lg border border-border ${getThemeStyle(newTheme).bg}`}
                  >
                    <Palette size={20} className={getThemeStyle(newTheme).text} />
                  </button>
                  {showColorPicker === 'new' && (
                    <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg p-2 grid grid-cols-6 gap-1 z-10 min-w-[200px]">
                      {THEME_COLORS.map(color => (
                        <button
                          key={color.id}
                          onClick={() => { setNewTheme(color.id); setShowColorPicker(null); }}
                          className={`w-7 h-7 rounded-lg ${color.bg} hover:ring-2 ring-primary transition-all`}
                          title={color.label}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddType}
                  disabled={!newLabel.trim()}
                  className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Existing Types */}
            <div className="space-y-2">
              {types.map(type => {
                const style = getThemeStyle(type.theme);
                return (
                  <div
                    key={type.id}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl group"
                  >
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
                      {type.label}
                    </span>
                    <div className="flex-1" />
                    <div className="relative">
                      <button
                        onClick={() => setShowColorPicker(showColorPicker === type.id ? null : type.id)}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Palette size={16} className="text-muted-foreground" />
                      </button>
                      {showColorPicker === type.id && (
                        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg p-2 grid grid-cols-6 gap-1 z-10 min-w-[200px]">
                          {THEME_COLORS.map(color => (
                            <button
                              key={color.id}
                              onClick={() => handleChangeTheme(type.id, color.id)}
                              className={`w-7 h-7 rounded-lg ${color.bg} hover:ring-2 ring-primary transition-all ${type.theme === color.id ? 'ring-2 ring-primary' : ''}`}
                              title={color.label}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteType(type.id)}
                      className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </button>
                  </div>
                );
              })}
              {types.length === 0 && (
                <p className="text-center text-muted-foreground py-8">{t('noEventTypes')}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 p-4 border-t border-border">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-colors"
            >
              {t('save')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

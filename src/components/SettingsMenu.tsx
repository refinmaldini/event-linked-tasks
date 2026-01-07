import React, { useState, useRef, useEffect } from 'react';
import { Settings, Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export const SettingsMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        title="Settings"
      >
        <Settings size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t('language')}
              </div>
              <button
                onClick={() => setLanguage('en')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  language === 'en' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Globe size={16} />
                <span className="font-medium">English</span>
                {language === 'en' && (
                  <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    ✓
                  </span>
                )}
              </button>
              <button
                onClick={() => setLanguage('id')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  language === 'id' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Globe size={16} />
                <span className="font-medium">Bahasa Indonesia</span>
                {language === 'id' && (
                  <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    ✓
                  </span>
                )}
              </button>
            </div>

            <div className="border-t border-border p-2">
              <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Theme
              </div>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors text-left"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                <span className="font-medium">
                  {theme === 'light' ? t('darkMode') : t('lightMode')}
                </span>
                <div className={`ml-auto w-10 h-5 rounded-full relative transition-colors ${
                  theme === 'dark' ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    theme === 'dark' ? 'left-5' : 'left-0.5'
                  }`} />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

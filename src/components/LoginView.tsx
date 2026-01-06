import React, { useState } from 'react';
import { User } from '../types';
import { Zap, ArrowRight, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
  showDefaultInfo?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ users, onLogin, showDefaultInfo = true }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card max-w-md w-full rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="p-8 pb-0 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Zap size={32} className="text-primary-foreground fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Enter your credentials to access your workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                placeholder="admin"
                value={username}
                onChange={e => {setUsername(e.target.value); setError('');}}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full pl-10 pr-12 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                placeholder="••••••"
                value={password}
                onChange={e => {setPassword(e.target.value); setError('');}}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold text-center animate-in">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-foreground text-background font-bold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            Login
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          {showDefaultInfo && (
            <div className="text-center mt-6 p-4 bg-muted rounded-xl border border-border animate-in">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Default Login</p>
              <p className="text-sm font-mono text-foreground">User: <span className="font-bold">admin</span> | Pass: <span className="font-bold">123</span></p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

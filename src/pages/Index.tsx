import React, { useState, useEffect } from 'react';
import { 
  Layout, Users, CheckSquare, Calendar as CalendarIcon, CalendarDays,
  LogOut, Plus, Briefcase, Zap, History
} from 'lucide-react';
import { Task, User, TaskStatus, Event, KanbanColumn, EventTypeConfig, ActivityLog } from '../types';
import { KanbanBoard } from '../components/KanbanBoard';
import { TeamView } from '../components/TeamView';
import { TaskListView } from '../components/TaskListView';
import { CalendarView } from '../components/CalendarView';
import { EventListView } from '../components/EventListView';
import { ActivityView } from '../components/ActivityView';
import { LoginView } from '../components/LoginView';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { CreateEventModal } from '../components/CreateEventModal';
import { CreateUserModal } from '../components/CreateUserModal';
import { SettingsMenu } from '../components/SettingsMenu';
import { useLanguage } from '../contexts/LanguageContext';

// --- HELPERS ---
const getAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=128`;

const loadState = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) { return fallback; }
};

// --- INITIAL DATA ---
const DEFAULT_ADMIN: User = { 
  id: 'u1', 
  name: 'Admin User', 
  username: 'admin',
  password: '123',
  avatar: getAvatar('Admin'), 
  role: 'Owner', 
  email: 'admin@kerja.app' 
};

const GLOBAL_TEAM_ID = 'global-workspace';

const INITIAL_COLUMNS: KanbanColumn[] = [
  { id: 'todo', title: 'TODO', theme: 'slate' },
  { id: 'in-progress', title: 'IN PROGRESS', theme: 'blue' },
  { id: 'done', title: 'DONE', theme: 'emerald' }
];

const INITIAL_EVENT_TYPES: EventTypeConfig[] = [
  { id: 'meeting', label: 'Meeting', theme: 'purple' },
  { id: 'workshop', label: 'Workshop', theme: 'amber' },
  { id: 'deadline', label: 'Deadline', theme: 'red' },
  { id: 'presentation', label: 'Presentation', theme: 'blue' }
];

const Index: React.FC = () => {
  const { t } = useLanguage();
  // -- AUTH STATE --
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => loadState('kerja_users', [DEFAULT_ADMIN])); 

  // -- APP STATE --
  const [activeTab, setActiveTab] = useState<'kanban' | 'team' | 'tasks' | 'calendar' | 'events' | 'activity'>('kanban');
  const [tasks, setTasks] = useState<Task[]>(() => loadState('kerja_tasks', []));
  const [events, setEvents] = useState<Event[]>(() => loadState('kerja_events', []));
  const [activities, setActivities] = useState<ActivityLog[]>(() => loadState('kerja_activities', []));
  
  const [kanbanColumns] = useState<KanbanColumn[]>(INITIAL_COLUMNS);
  const [eventTypes] = useState<EventTypeConfig[]>(INITIAL_EVENT_TYPES);
  
  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [taskInitialStatus, setTaskInitialStatus] = useState<TaskStatus>('todo');

  // Sync Users to ensure default admin always exists
  useEffect(() => {
    if (users.length === 0) {
      setUsers([DEFAULT_ADMIN]);
    }
  }, [users]);

  // Check for existing session
  useEffect(() => {
    const sessionId = localStorage.getItem('kerja_session');
    if (sessionId) {
      const found = users.find(u => u.id === sessionId);
      if (found) setCurrentUser(found);
    }
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem('kerja_tasks', JSON.stringify(tasks));
    localStorage.setItem('kerja_events', JSON.stringify(events));
    localStorage.setItem('kerja_users', JSON.stringify(users));
    localStorage.setItem('kerja_activities', JSON.stringify(activities));
    
    if (currentUser) {
      localStorage.setItem('kerja_session', currentUser.id);
    } else {
      localStorage.removeItem('kerja_session');
    }
  }, [tasks, events, users, activities, currentUser]);

  // --- HANDLERS ---
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    logActivity('logged in', user.name, 'team');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const logActivity = (action: string, target: string, type: ActivityLog['type'] = 'task') => {
    if (!currentUser) return;
    const newLog: ActivityLog = { 
      id: `log-${Date.now()}`, 
      userId: currentUser.id, 
      userName: currentUser.name, 
      userAvatar: currentUser.avatar, 
      action, 
      target, 
      type, 
      timestamp: new Date().toISOString() 
    };
    setActivities(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const getColumnTitle = (id: string) => {
    const col = kanbanColumns.find(c => c.id === id);
    if (col) return col.title;
    if (id === 'todo') return 'To Do';
    if (id === 'in-progress') return 'In Progress';
    if (id === 'done') return 'Done';
    return id;
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      const statusName = getColumnTitle(newStatus);
      logActivity(`moved to ${statusName}`, task.title, 'task');
    }
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'teamId'>) => {
    if (editingTask) {
      const changes: string[] = [];
      if (editingTask.status !== taskData.status) {
        changes.push(`moved to ${getColumnTitle(taskData.status)}`);
      }
      if (editingTask.priority !== taskData.priority) {
        changes.push(`priority set to ${taskData.priority}`);
      }
      if (editingTask.dueDate !== taskData.dueDate) {
        changes.push(`rescheduled to ${taskData.dueDate}`);
      }
      
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...editingTask, ...taskData } : t));
      
      if (changes.length > 0) {
        logActivity(changes.join(', '), taskData.title);
      } else if (editingTask.title !== taskData.title || editingTask.description !== taskData.description) {
        logActivity('updated details', taskData.title);
      }
    } else {
      const newTask: Task = { ...taskData, id: `t${Date.now()}`, teamId: GLOBAL_TEAM_ID };
      setTasks(prev => [newTask, ...prev]);
      logActivity('created task', taskData.title);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id' | 'teamId'>) => {
    if (editingEvent) {
      const changes: string[] = [];
      if (editingEvent.date !== eventData.date || editingEvent.startTime !== eventData.startTime) {
        changes.push(`rescheduled to ${eventData.date} ${eventData.startTime}`);
      }
      
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, ...eventData } : e));
      
      if (changes.length > 0) {
        logActivity(changes.join(', '), eventData.title, 'event');
      } else {
        logActivity('updated event details', eventData.title, 'event');
      }
    } else {
      const newEvent: Event = { ...eventData, id: `e${Date.now()}`, teamId: GLOBAL_TEAM_ID };
      setEvents(prev => [newEvent, ...prev]);
      logActivity('scheduled event', eventData.title, 'event');
    }
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleSaveUser = (userData: Omit<User, 'id'>) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...editingUser, ...userData } : u));
      logActivity('updated user profile', userData.name, 'team');
    } else {
      const newUser: User = { 
        ...userData, 
        id: `u-${Date.now()}`,
      };
      setUsers(prev => [...prev, newUser]);
      logActivity('added new member', userData.name, 'team');
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (currentUser?.id === userId) {
      alert("You cannot delete yourself.");
      return;
    }
    const user = users.find(u => u.id === userId);
    if (user) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      logActivity('removed user', user.name, 'team');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      logActivity('deleted task', task.title);
      setIsTaskModalOpen(false);
      setEditingTask(null);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
      logActivity('cancelled event', event.title, 'event');
      setIsEventModalOpen(false);
      setEditingEvent(null);
    }
  };

  // Global Add Task handler
  const handleGlobalAddTask = () => {
    setEditingTask(null);
    setTaskInitialStatus('todo');
    setIsTaskModalOpen(true);
  };

  // If not logged in, show Login View
  if (!currentUser) {
    const isDefaultCredsActive = users.some(u => u.username === 'admin' && u.password === '123');
    return <LoginView users={users} onLogin={handleLogin} showDefaultInfo={isDefaultCredsActive} />;
  }

  const NAV_ITEMS = [
    { id: 'kanban', label: t('kanban'), icon: Layout },
    { id: 'team', label: t('team'), icon: Users },
    { id: 'tasks', label: t('tasks'), icon: CheckSquare },
    { id: 'calendar', label: t('calendar'), icon: CalendarIcon },
    { id: 'events', label: t('events'), icon: CalendarDays },
    { id: 'activity', label: t('activity'), icon: History },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      <nav className="bg-card border-b border-border h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-8">
          {/* BRAND HEADER */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg">
              <Zap className="fill-current w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground leading-none tracking-tight">KERJA!</div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Workspace</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id as any)} 
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize flex items-center gap-2 transition-colors ${
                  activeTab === item.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon size={16} /> {item.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* GLOBAL ADD TASK BUTTON - Always visible */}
          <button 
            onClick={handleGlobalAddTask}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:opacity-90 transition-all text-sm"
          >
            <Plus size={18} /> {t('addTask')}
          </button>

          {/* Settings Menu */}
          <SettingsMenu />

          <div className="bg-muted rounded-full px-3 py-1.5 flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold uppercase">
              {currentUser.name[0]}
            </div>
            <span className="text-sm font-medium hidden sm:inline text-foreground">{currentUser.name}</span>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" 
            title={t('logout')}
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="md:hidden flex overflow-x-auto gap-1 p-2 bg-card border-b border-border">
        {NAV_ITEMS.map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id as any)} 
            className={`px-3 py-2 rounded-lg text-xs font-medium capitalize flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === item.id 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <item.icon size={14} /> {item.label}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold capitalize">
              {NAV_ITEMS.find(i => i.id === activeTab)?.label}
            </h1>
          <p className="text-muted-foreground flex items-center gap-2">
              <Briefcase size={14} /> {t('mainWorkspace')}
            </p>
          </div>
          <div className="flex gap-3">
            {activeTab === 'events' && (
              <button 
                onClick={() => { setEditingEvent(null); setIsEventModalOpen(true); }} 
                className="bg-foreground text-background px-5 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:opacity-90 transition-colors"
              >
                <Plus size={18} /> {t('addEvent')}
              </button>
            )}
            {activeTab === 'team' && currentUser.role === 'Owner' && (
              <button 
                onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }} 
                className="bg-foreground text-background px-5 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:opacity-90 transition-colors"
              >
                <Plus size={18} /> {t('addMember')}
              </button>
            )}
          </div>
        </header>

        <div className="animate-in">
          {activeTab === 'kanban' && (
            <KanbanBoard 
              tasks={tasks} 
              users={users} 
              columns={kanbanColumns}
              events={events}
              onStatusChange={handleStatusChange} 
              onAddTask={s => { setTaskInitialStatus(s); setEditingTask(null); setIsTaskModalOpen(true); }} 
              onTaskClick={t => { setEditingTask(t); setIsTaskModalOpen(true); }}
              onEventClick={e => { setEditingEvent(e); setIsEventModalOpen(true); }}
            />
          )}
          {activeTab === 'team' && (
            <TeamView 
              users={users} 
              tasks={tasks} 
              onEditUser={(u) => { setEditingUser(u); setIsUserModalOpen(true); }} 
              onDeleteUser={handleDeleteUser} 
            />
          )}
          {activeTab === 'tasks' && (
            <TaskListView 
              tasks={tasks} 
              users={users} 
              columns={kanbanColumns}
              events={events}
              onStatusChange={handleStatusChange} 
              onTaskClick={t => { setEditingTask(t); setIsTaskModalOpen(true); }}
              onEventClick={e => { setEditingEvent(e); setIsEventModalOpen(true); }}
            />
          )}
          {activeTab === 'calendar' && (
            <CalendarView 
              tasks={tasks} 
              events={events} 
              onEventClick={e => { setEditingEvent(e); setIsEventModalOpen(true); }} 
              onTaskClick={t => { setEditingTask(t); setIsTaskModalOpen(true); }} 
            />
          )}
          {activeTab === 'events' && (
            <EventListView 
              events={events} 
              users={users} 
              eventTypes={eventTypes} 
              onAddEvent={() => { setEditingEvent(null); setIsEventModalOpen(true); }} 
              onEventClick={e => { setEditingEvent(e); setIsEventModalOpen(true); }} 
            />
          )}
          {activeTab === 'activity' && <ActivityView activities={activities} />}
        </div>
      </main>

      {/* No Events Warning Banner */}
      {events.length === 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-accent border border-primary/20 rounded-xl p-4 shadow-lg z-40">
          <div className="flex items-start gap-3">
            <CalendarDays className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-foreground">{t('createEventFirst')}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {t('needEventFirst')}
              </p>
              <button 
                onClick={() => { setEditingEvent(null); setIsEventModalOpen(true); }}
                className="mt-3 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-colors"
              >
                {t('createFirstEvent')}
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }} 
        users={users} 
        currentUser={currentUser} 
        events={events} 
        columns={kanbanColumns} 
        onSave={handleSaveTask} 
        onDelete={handleDeleteTask} 
        initialStatus={taskInitialStatus} 
        taskToEdit={editingTask} 
      />
      <CreateEventModal 
        isOpen={isEventModalOpen} 
        onClose={() => { setIsEventModalOpen(false); setEditingEvent(null); }} 
        users={users} 
        onSave={handleSaveEvent} 
        onDelete={handleDeleteEvent} 
        eventToEdit={editingEvent} 
        eventTypes={eventTypes} 
      />
      <CreateUserModal 
        isOpen={isUserModalOpen} 
        onClose={() => { setIsUserModalOpen(false); setEditingUser(null); }} 
        onSave={handleSaveUser} 
        userToEdit={editingUser} 
      />
    </div>
  );
};

export default Index;

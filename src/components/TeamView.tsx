import React from 'react';
import { User, Task } from '../types';
import { Mail, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TeamViewProps {
  users: User[];
  tasks: Task[];
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  onAddMember?: () => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ 
  users, 
  tasks, 
  onEditUser, 
  onDeleteUser,
  onAddMember
}) => {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performanceData = users.map(user => {
    const userTasks = tasks.filter(t => t.assigneeId === user.id);
    return {
      name: user.name.split(' ')[0],
      completed: userTasks.filter(t => t.status === 'done').length,
      active: userTasks.filter(t => t.status !== 'done').length,
    };
  });

  const handleDeleteClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setTimeout(() => {
      if(confirm(`Are you sure you want to remove ${user.name} from the team?`)) {
        if (onDeleteUser) onDeleteUser(user.id);
      }
    }, 50);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Team Overview</h2>
          <p className="text-muted-foreground">Manage team members and their tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Members List */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Active Members</h3>
          <div className="space-y-4" ref={menuRef}>
            {users.map(user => (
              <div key={user.id} className="bg-card p-4 rounded-xl shadow-sm border border-border flex items-center justify-between relative group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-border" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground">{user.name}</h4>
                      {user.role === 'Owner' && <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Owner</span>}
                      {user.role === 'Guest' && <span className="bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Guest</span>}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Mail size={12} />
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex gap-2">
                    <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-md font-medium">
                      {tasks.filter(t => t.assigneeId === user.id && t.status === 'done').length} Done
                    </span>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === user.id ? null : user.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${activeMenuId === user.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeMenuId === user.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-xl border border-border z-20 p-1 animate-in">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            onEditUser && onEditUser(user); 
                            setActiveMenuId(null);
                          }} 
                          className="w-full text-left px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg flex items-center gap-2"
                        >
                          <Edit2 size={14} /> Edit Member
                        </button>
                        <button 
                          onClick={(e) => handleDeleteClick(e, user)} 
                          className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Remove User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border min-h-[300px]">
          <h3 className="text-lg font-bold text-foreground mb-6">Task Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))' }}
                  cursor={{fill: 'hsl(var(--muted))'}}
                />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} barSize={32} />
                <Bar dataKey="active" name="Active" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

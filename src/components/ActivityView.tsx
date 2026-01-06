import React from 'react';
import { ActivityLog } from '../types';
import { History, MoveRight, Plus, CheckCircle2 } from 'lucide-react';

interface ActivityViewProps {
  activities: ActivityLog[];
}

export const ActivityView: React.FC<ActivityViewProps> = ({ activities }) => {
  const sortedActivities = [...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getIcon = (action: string) => {
    if (action.includes('moved')) return <MoveRight size={14} className="text-blue-500" />;
    if (action.includes('created')) return <Plus size={14} className="text-emerald-500" />;
    if (action.includes('completed')) return <CheckCircle2 size={14} className="text-green-500" />;
    return <History size={14} className="text-muted-foreground" />;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <History size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Activity Log</h2>
          <p className="text-muted-foreground">Track recent team changes and updates.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {sortedActivities.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <History size={48} className="mb-4 opacity-20" />
            <p>No activity recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedActivities.map(activity => (
              <div key={activity.id} className="p-4 flex gap-4 hover:bg-muted/50 transition-colors">
                <img src={activity.userAvatar} alt={activity.userName} className="w-10 h-10 rounded-full border border-border mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-foreground">
                      <span className="font-bold">{activity.userName}</span>
                      <span className="text-muted-foreground mx-1">{activity.action}</span>
                      <span className="font-medium text-foreground">"{activity.target}"</span>
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="bg-muted p-1 rounded-md">
                      {getIcon(activity.action)}
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      {activity.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

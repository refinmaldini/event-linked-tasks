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
    <div className="max-w-3xl mx-auto px-0 sm:px-4">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <History size={20} className="sm:w-6 sm:h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Activity Log</h2>
          <p className="text-muted-foreground text-sm hidden sm:block">Track recent team changes and updates.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {sortedActivities.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-muted-foreground flex flex-col items-center">
            <History size={40} className="sm:w-12 sm:h-12 mb-4 opacity-20" />
            <p className="text-sm sm:text-base">No activity recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedActivities.map(activity => (
              <div key={activity.id} className="p-3 sm:p-4 flex gap-3 sm:gap-4 hover:bg-muted/50 transition-colors">
                <img src={activity.userAvatar} alt={activity.userName} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border mt-0.5 sm:mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <p className="text-xs sm:text-sm text-foreground">
                      <span className="font-bold">{activity.userName}</span>
                      <span className="text-muted-foreground mx-1">{activity.action}</span>
                      <span className="font-medium text-foreground break-words">"{activity.target}"</span>
                    </p>
                    <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="bg-muted p-1 rounded-md">
                      {getIcon(activity.action)}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wide">
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

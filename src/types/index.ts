export type TaskStatus = string;

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  avatar: string;
  role: 'Owner' | 'Member' | 'Guest';
  email: string;
}

export interface Task {
  id: string;
  teamId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  eventId: string; // Required - Task MUST be linked to an event
  eventName?: string;
  duration?: string;
  assetLink?: string;
  projectLink?: string;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export type EventType = string;

export interface Event {
  id: string;
  teamId: string;
  title: string;
  description: string;
  date: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type: EventType;
  attendees: string[];
  location?: string;
  clientName?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'task' | 'event' | 'team';
}

export type ColorTheme = 'slate' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose';

export interface KanbanColumn {
  id: string;
  title: string;
  theme: ColorTheme;
}

export interface EventTypeConfig {
  id: string;
  label: string;
  theme: ColorTheme;
}

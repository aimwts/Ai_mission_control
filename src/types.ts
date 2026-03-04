export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
}

export interface SystemStatus {
  status: string;
  uptime: number;
  memory: number;
  platform: string;
  nodeVersion: string;
}

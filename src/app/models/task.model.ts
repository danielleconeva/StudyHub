export interface Subtask {
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  ownerId: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  subtasks: Subtask[];
  createdAt: string;
  completed: boolean;
}

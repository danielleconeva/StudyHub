import { Timestamp } from "firebase/firestore";

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
  due: Timestamp;
  completed: boolean;
}

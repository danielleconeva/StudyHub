import { Timestamp } from '@angular/fire/firestore';
export interface SyllabusItem {
  text: string;
  done: boolean;
}

export interface StudyPage {
  id: string;
  title: string;
  subject: string;
  syllabus: SyllabusItem[];
  isPublic: boolean;
  ownerId: string;
  createdAt: string | Timestamp;
  resources: String[];
  notes: string;
  likesCount: number;
}

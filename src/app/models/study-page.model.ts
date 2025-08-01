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
  createdAt: string; 
  resources: String[];
  notes: string;
  likesCount: number;
}

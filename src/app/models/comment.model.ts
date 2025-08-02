import { Timestamp } from "firebase/firestore";

export interface Comment {
  id?: string;
  pageId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string | Timestamp;
}

import {
  Component,
  computed,
  inject,
  signal,
  OnInit
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';

import { StudyPagesService } from '../../../core/services/study-pages.service';
import { Auth, User } from '@angular/fire/auth';
import { Comment } from '../../../models/comment.model';

@Component({
  selector: 'app-my-study-page-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './my-study-page-details.html',
  styleUrl: './my-study-page-details.css',
})
export class MyStudyPageDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private studyPagesService = inject(StudyPagesService);
  private auth = inject(Auth);

  pageId = signal<string | null>(null);
  currentUserId = signal<string | null>(null);

  isLoggedIn = computed(() => !!this.currentUserId());

  pagesSignal = this.studyPagesService.getStudyPages();

  page = computed(() => {
    const id = this.pageId();
    const allPages = this.pagesSignal() ?? [];
    return allPages.find((p) => p.id === id) ?? null;
  });

  comments = computed(() => {
    const all = this.studyPagesService.getComments()() ?? [];
    const id = this.pageId();
    return id ? all.filter((c) => c.pageId === id) : [];
  });

  newComment = signal<string>('');

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (!id) return;

      this.pageId.set(id);
      await this.checkUser();
    });
  }

  async checkUser() {
    const user = await new Promise<User | null>((resolve) =>
      this.auth.onAuthStateChanged((u) => resolve(u))
    );
    this.currentUserId.set(user?.uid ?? null);
  }

  async onCommentSubmit(event: Event) {
    event.preventDefault();

    const text = this.newComment().trim();
    const pageId = this.page()?.id;

    if (!text || !pageId) return;

    const user = await new Promise<User | null>((resolve) =>
      this.auth.onAuthStateChanged((u) => resolve(u))
    );
    if (!user) return;

    const comment: Comment = {
      pageId,
      userId: user.uid,
      username: user.displayName || user.email || 'Anonymous',
      text,
      createdAt: new Date().toISOString(),
    };

    await this.studyPagesService.addComment(comment);
    this.newComment.set('');
  }

  async onDeleteComment(comment: Comment) {
    const confirmDelete = confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    await this.studyPagesService.deleteComment(comment);
  }

  formatDate(date: string | Timestamp): string {
    if (typeof date === 'string') {
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? '' : parsed.toLocaleDateString();
    }

    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString();
    }

    return '';
  }
  async toggleSyllabusItem(index: number) {
    const current = this.page();
    if (!current || !current.id || !current.syllabus) return;

    const updatedSyllabus = [...current.syllabus];
    updatedSyllabus[index] = {
      ...updatedSyllabus[index],
      done: !updatedSyllabus[index].done
    };

    try {
      await this.studyPagesService.updateStudyPage(current.id, {
        syllabus: updatedSyllabus
      });
    } catch (error) {
      console.error('Failed to update syllabus:', error);
    }
  }

}

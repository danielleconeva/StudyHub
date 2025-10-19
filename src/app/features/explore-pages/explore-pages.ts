import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { StudyPagesService } from '../../core/services/study-pages.service';
import { AuthService, User } from '../../core/services/auth.service';
import { StudyPage } from '../../models/study-page.model';
import { Comment } from '../../models/comment.model';
import { Like } from '../../models/like.model';
import { Timestamp } from '@angular/fire/firestore';
import { StudyPageItem } from './study-page-item/study-page-item';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-explore-pages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StudyPageItem],
  templateUrl: './explore-pages.html',
  styleUrls: ['./explore-pages.css'],
})
export class ExplorePages {
  private studyPageService = inject(StudyPagesService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private modal = inject(ModalService);

  studyPages = this.studyPageService.getStudyPages();
  comments = this.studyPageService.getComments();
  users = signal<User[]>([]);
  likedPages = signal<Set<string>>(new Set());

  searchQuery = signal('');
  selectedSubject = signal('All Subjects');
  sortOption = signal('Most Popular');
  visibleCount = signal(4);

  isLoggedIn = this.authService.isLoggedIn;
  currentUserId = computed(() => this.authService.currentUser()?.id ?? '');

  constructor() {
    this.authService.getAllUsers().subscribe((userList) => {
      this.users.set(userList);
    });

    effect(() => {
      const allLikes = this.studyPageService.getLikes()();
      const userId = this.authService.getCurrentUserId();
      if (!allLikes || !userId) return;

      const likedSet = new Set<string>(
        allLikes.filter((like: Like) => like.userId === userId).map((like: Like) => like.pageId)
      );
      this.likedPages.set(likedSet);
    });
  }

  getAuthorName(ownerId: string): string {
    const user = this.users().find((u) => u.id === ownerId);
    return user?.username ?? 'Anonymous';
  }

  getSubjects(): string[] {
    const subjects = new Set(
      (this.studyPages() ?? []).filter((p) => p?.subject).map((p) => p.subject)
    );
    return ['All Subjects', ...Array.from(subjects)];
  }

  getCommentCount(pageId: string): number {
    return this.comments()?.filter((c: Comment) => c.pageId === pageId).length ?? 0;
  }

  formatDate(timestamp: string | Timestamp): string {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp?.toDate?.() ?? new Date();
    return date.toLocaleDateString('en-GB');
  }

  loadMore() {
    this.visibleCount.update((count) => count + 4);
  }

  allFilteredPages = computed(() => {
    const all = this.studyPages() ?? [];
    if (!Array.isArray(all) || all.length === 0) return [];

    return all
      .filter((p) => p?.isPublic === true)
      .filter((p) => this.selectedSubject() === 'All Subjects' || p.subject === this.selectedSubject())
      .filter(
        (p) =>
          (p.title?.toLowerCase() ?? '').includes(this.searchQuery().toLowerCase()) ||
          (p.notes?.toLowerCase() ?? '').includes(this.searchQuery().toLowerCase())
      )
      .map((p) => ({ ...p, notes: typeof p.notes === 'string' ? p.notes : '' }));
  });

  filteredPages = computed(() => {
    const pages = this.sortPages(this.allFilteredPages());
    return pages.slice(0, this.visibleCount());
  });

  private sortPages(pages: StudyPage[]) {
    const getMillis = (value: string | Timestamp): number => {
      if (typeof value === 'string') return Date.parse(value);
      if ((value as Timestamp)?.toMillis) return (value as Timestamp).toMillis();
      return 0;
    };

    switch (this.sortOption()) {
      case 'Most Popular':
        return [...pages].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
      case 'Newest':
        return [...pages].sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));
      default:
        return pages;
    }
  }

  likePage(page: StudyPage) {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.studyPageService
      .toggleLike(page.id, userId)
      .then((action) => {
        const updatedSet = new Set(this.likedPages());
        if (action === 'liked') {
          updatedSet.add(page.id);
          page.likesCount = (page.likesCount || 0) + 1;
        } else {
          updatedSet.delete(page.id);
          page.likesCount = Math.max((page.likesCount || 1) - 1, 0);
        }
        this.likedPages.set(updatedSet);
      })
      .catch((err) => {
        console.error('Like toggle failed:', err);
        this.modal.error('Like toggle failed');
      });
  }

  handleEdit(page: StudyPage) {
    this.router.navigate(['/my-study-pages/edit', page.id]);
  }

  async handleDelete(page: StudyPage) {
    const userId = this.currentUserId();
    if (page.ownerId !== userId) {
      this.modal.error('You are not allowed to delete this page.');
      return;
    }

    const ok = await this.modal.confirm(
      'Are you sure you want to delete this study page?',
      'Confirm deletion'
    );
    if (!ok) return;

    this.studyPageService
      .deleteStudyPage(page.id)
      .then(() => {
      })
      .catch((err) => {
        console.error('Delete failed:', err);
        this.modal.error('Delete failed');
      });
  }
}

import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { StudyPagesService } from '../../core/services/study-pages.service';
import { AuthService } from '../../core/services/auth.service';
import { StudyPage } from '../../models/study-page.model';

import { MyStudyPageItem } from './my-study-page-item/my-study-page-item';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-my-study-pages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MyStudyPageItem
  ],
  templateUrl: './my-study-pages.html',
  styleUrls: ['./my-study-pages.css']
})
export class MyStudyPages {
  private studyPagesService = inject(StudyPagesService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private modal = inject(ModalService);

  allPages = this.studyPagesService.getStudyPages();
  userId = signal<string | null>(null);

  searchQuery = signal('');
  selectedSubject = signal('All Subjects');
  selectedStatus = signal<'All Status' | 'Published' | 'Draft'>('All Status');
  visibleCount = signal(6);

  constructor() {
    effect(() => {
      const uid = this.authService.getCurrentUserId();
      this.userId.set(uid ?? null);
    });

    effect(() => {
      console.log('📘 My pages:', this.filteredPages());
    });
  }

  getSubjects(): string[] {
    const subjects = new Set(
      (this.filteredPages() ?? [])
        .filter(p => p?.subject)
        .map(p => p.subject)
    );
    return ['All Subjects', ...Array.from(subjects)];
  }

  filteredPages = computed(() => {
    const pages = this.allPages() ?? [];
    const userId = this.userId();

    if (!userId) return [];

    return pages
      .filter(p => p.ownerId === userId)
      .filter(p =>
        this.selectedSubject() === 'All Subjects' || p.subject === this.selectedSubject()
      )
      .filter(p =>
        this.selectedStatus() === 'All Status' ||
        (this.selectedStatus() === 'Published' && p.isPublic) ||
        (this.selectedStatus() === 'Draft' && !p.isPublic)
      )
      .filter(p =>
        (p.title?.toLowerCase() ?? '').includes(this.searchQuery().toLowerCase()) ||
        (p.notes?.toLowerCase() ?? '').includes(this.searchQuery().toLowerCase())
      )
      .slice(0, this.visibleCount());
  });

  createNewPage() {
    this.router.navigate(['/my-study-pages/new']);
  }

  loadMore() {
    this.visibleCount.update(count => count + 4);
  }

  extractTags(page: StudyPage): string[] {
    if (!page.syllabus || !Array.isArray(page.syllabus)) return [];
    return page.syllabus.slice(0, 3).map((item) => item?.text || 'General');
  }

  onEdit(page: StudyPage) {
    const currentUserId = this.userId();
    if (page.ownerId !== currentUserId) {
      this.modal.error('You cannot edit someone else’s page.');
      return;
    }

    this.router.navigate(['/my-study-pages', 'edit', page.id]);
  }

  async onDelete(page: StudyPage) {
    const currentUserId = this.userId();
    if (page.ownerId !== currentUserId) {
      this.modal.error('You are not allowed to delete this page.');
      return;
    }

    const ok = await this.modal.confirm(
      'Are you sure you want to delete this study page?',
      'Confirm deletion'
    );
    if (!ok) return;

    this.studyPagesService.deleteStudyPage(page.id)
      .then(() => {
        console.log('Deleted:', page.id);

      })
      .catch((err: unknown) => {
        console.error('Delete failed:', err);
        this.modal.error('Delete failed');
      });
  }

  onToggleVisibility(event: { page: StudyPage; newValue: boolean }) {
    this.studyPagesService.updateStudyPage(event.page.id, {
      isPublic: event.newValue
    }).then(() => {
      console.log('Visibility updated');
    }).catch((err: unknown) => {
      console.error('Visibility update failed:', err);
      this.modal.error('Visibility update failed');
    });
  }
}

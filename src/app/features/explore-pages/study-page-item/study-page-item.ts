import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StudyPage } from '../../../models/study-page.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-study-page-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './study-page-item.html',
  styleUrl: './study-page-item.css',
})
export class StudyPageItem {
  @Input() page!: StudyPage;
  @Input() author: string = 'Anonymous';
  @Input() commentCount: number = 0;
  @Input() isLiked: boolean = false;
  @Input() isLoggedIn: boolean = false;
  @Input() currentUserId!: string; // ✅ New input

  @Output() like = new EventEmitter<StudyPage>();
  @Output() edit = new EventEmitter<StudyPage>();   // ✅ Emits edit request
  @Output() delete = new EventEmitter<StudyPage>(); // ✅ Emits delete request

  constructor(
    private router: Router,
    private scroller: ViewportScroller
  ) { }

  formatDate(value: string | Timestamp): string {
    const date = typeof value === 'string' ? new Date(value) : value.toDate();
    return date.toLocaleDateString('en-GB');
  }

  handleLikeClick() {
    if (!this.isLoggedIn) return;
    this.like.emit(this.page);
  }

  navigateToPage(pageId: string) {
    this.router.navigate(['/explore', pageId]).then(() => {
      this.scroller.scrollToPosition([0, 0]);
    });
  }

  // ✅ Button event handlers
  handleEdit() {
    this.edit.emit(this.page);
  }

  handleDelete() {
    this.delete.emit(this.page);
  }

  // ✅ Utility to check if current user owns the page
  isOwner(): boolean {
    return this.page.ownerId === this.currentUserId && this.page.isPublic;
  }
}

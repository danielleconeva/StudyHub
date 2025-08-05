import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';

import { StudyPage } from '../../../models/study-page.model';

@Component({
  selector: 'app-my-study-page-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-study-page-item.html',
  styleUrl: './my-study-page-item.css'
})
export class MyStudyPageItem {
  @Input() page!: StudyPage;
  @Input() isPublic: boolean = false;
  @Input() likes: number = 0;
  @Input() subject: string = '';
  @Input() tags: string[] = [];
  @Input() visibility: 'public' | 'private' = 'private';


  @Output() edit = new EventEmitter<StudyPage>();
  @Output() delete = new EventEmitter<StudyPage>();
  @Output() toggleVisibility = new EventEmitter<{ page: StudyPage; newValue: boolean }>();

  constructor(private router: Router) { }

  formatDate(value: string | Timestamp): string {
    const date = typeof value === 'string' ? new Date(value) : value.toDate();
    return date.toLocaleDateString('en-GB');
  }

  get visibilityStatus(): 'Published' | 'Private' {
    return this.isPublic ? 'Published' : 'Private';
  }


  navigateToPage(pageId: string): void {
    this.router.navigate(['/my-study-pages', pageId]);
  }

  handleEdit(): void {
    this.edit.emit(this.page);
  }

  handleDelete(): void {
    this.delete.emit(this.page);
  }

  handleToggleVisibility(): void {
    const newVisibility = !this.isPublic;
    this.isPublic = newVisibility;
    this.toggleVisibility.emit({ page: this.page, newValue: newVisibility });
  }

}

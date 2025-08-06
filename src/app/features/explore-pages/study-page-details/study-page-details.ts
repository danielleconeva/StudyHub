import {
  Component,
  computed,
  inject,
  signal,
  OnInit
} from '@angular/core';
import { NgFor, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Auth, User } from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';
import { StudyPagesService } from '../../../core/services/study-pages.service';
import { Comment } from '../../../models/comment.model';
import { StudyPage } from '../../../models/study-page.model';

@Component({
  selector: 'app-study-page-details',
  standalone: true,
  templateUrl: './study-page-details.html',
  styleUrls: ['./study-page-details.css'],
  imports: [NgFor, RouterLink, FormsModule],
})
export class StudyPageDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);
  private studyPagesService = inject(StudyPagesService);
  private scroller = inject(ViewportScroller);

  pageId = signal<string | null>(null);
  currentUserId = signal<string | null>(null);
  page = signal<StudyPage | null>(null);
  newComment = signal<string>('');
  isLikedByCurrentUser = signal(false);

  isLoggedIn = computed(() => !!this.currentUserId());

  comments = computed(() => {
    const all = this.studyPagesService.getComments()() ?? [];
    const id = this.pageId();
    return id ? all.filter((c) => c.pageId === id) : [];
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.pageId.set(id);
    await this.checkUser();

    const pageData = await this.studyPagesService.getPageById(id);

    if (!pageData || !pageData.isPublic) {
      this.router.navigate(['/404']);
      return;
    }

    this.page.set(pageData);
    await this.checkIfLiked(id);

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => this.scroller.scrollToAnchor(fragment), 0);
      }
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
    if (!confirm('Are you sure you want to delete this comment?')) return;
    await this.studyPagesService.deleteComment(comment);
  }

  async checkIfLiked(pageId: string) {
    const allLikes = this.studyPagesService.getLikes()() ?? [];
    const userId = this.currentUserId();
    const liked = allLikes.some((like) => like.pageId === pageId && like.userId === userId);
    this.isLikedByCurrentUser.set(liked);
  }

  async toggleLike() {
    const pageId = this.page()?.id;
    const userId = this.currentUserId();
    if (!pageId || !userId) return;

    const result = await this.studyPagesService.toggleLike(pageId, userId);
    this.isLikedByCurrentUser.set(result === 'liked');

    const current = this.page();
    if (current) {
      this.page.set({
        ...current,
        likesCount: current.likesCount + (result === 'liked' ? 1 : -1),
      });
    }
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
}

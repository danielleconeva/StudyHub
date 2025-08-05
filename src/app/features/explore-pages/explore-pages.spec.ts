import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorePages } from './explore-pages';

describe('ExplorePages', () => {
  let component: ExplorePages;
  let fixture: ComponentFixture<ExplorePages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorePages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorePages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyPageItem } from './study-page-item';

describe('StudyPageItem', () => {
  let component: StudyPageItem;
  let fixture: ComponentFixture<StudyPageItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyPageItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyPageItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

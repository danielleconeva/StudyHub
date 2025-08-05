import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyPageDetails } from './study-page-details';

describe('StudyPageDetails', () => {
  let component: StudyPageDetails;
  let fixture: ComponentFixture<StudyPageDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyPageDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyPageDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

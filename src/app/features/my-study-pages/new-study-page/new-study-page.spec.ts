import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStudyPage } from './new-study-page';

describe('NewStudyPage', () => {
  let component: NewStudyPage;
  let fixture: ComponentFixture<NewStudyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewStudyPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewStudyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

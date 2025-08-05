import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStudyPage } from './edit-study-page';

describe('EditStudyPage', () => {
  let component: EditStudyPage;
  let fixture: ComponentFixture<EditStudyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStudyPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStudyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

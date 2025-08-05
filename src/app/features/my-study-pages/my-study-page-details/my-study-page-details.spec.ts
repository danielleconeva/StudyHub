import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStudyPageDetails } from './my-study-page-details';

describe('MyStudyPageDetails', () => {
  let component: MyStudyPageDetails;
  let fixture: ComponentFixture<MyStudyPageDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyStudyPageDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyStudyPageDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

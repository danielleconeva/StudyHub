import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStudyPages } from './my-study-pages';

describe('MyStudyPages', () => {
  let component: MyStudyPages;
  let fixture: ComponentFixture<MyStudyPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyStudyPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyStudyPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

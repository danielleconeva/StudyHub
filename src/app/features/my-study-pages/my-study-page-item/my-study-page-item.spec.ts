import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStudyPageItem } from './my-study-page-item';

describe('MyStudyPageItem', () => {
  let component: MyStudyPageItem;
  let fixture: ComponentFixture<MyStudyPageItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyStudyPageItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyStudyPageItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

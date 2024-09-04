import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRatingViewComponent } from './daily-rating-view.component';

describe('DailyRatingViewComponent', () => {
  let component: DailyRatingViewComponent;
  let fixture: ComponentFixture<DailyRatingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyRatingViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyRatingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

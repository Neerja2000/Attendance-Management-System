import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDailyRatingComponent } from './view-daily-rating.component';

describe('ViewDailyRatingComponent', () => {
  let component: ViewDailyRatingComponent;
  let fixture: ComponentFixture<ViewDailyRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDailyRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDailyRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDailyRatingComponent } from './add-daily-rating.component';

describe('AddDailyRatingComponent', () => {
  let component: AddDailyRatingComponent;
  let fixture: ComponentFixture<AddDailyRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDailyRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDailyRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

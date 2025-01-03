import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRatingComponent } from './view-rating.component';

describe('ViewRatingComponent', () => {
  let component: ViewRatingComponent;
  let fixture: ComponentFixture<ViewRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

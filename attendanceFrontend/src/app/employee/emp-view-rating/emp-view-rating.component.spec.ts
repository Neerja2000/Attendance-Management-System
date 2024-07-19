import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpViewRatingComponent } from './emp-view-rating.component';

describe('EmpViewRatingComponent', () => {
  let component: EmpViewRatingComponent;
  let fixture: ComponentFixture<EmpViewRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpViewRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpViewRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

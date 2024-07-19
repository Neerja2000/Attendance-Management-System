import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAddRatingComponent } from './emp-add-rating.component';

describe('EmpAddRatingComponent', () => {
  let component: EmpAddRatingComponent;
  let fixture: ComponentFixture<EmpAddRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpAddRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpAddRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

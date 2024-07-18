import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpViewAttendanceComponent } from './emp-view-attendance.component';

describe('EmpViewAttendanceComponent', () => {
  let component: EmpViewAttendanceComponent;
  let fixture: ComponentFixture<EmpViewAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpViewAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpViewAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

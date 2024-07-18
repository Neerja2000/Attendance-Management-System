import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAddAttendanceComponent } from './emp-add-attendance.component';

describe('EmpAddAttendanceComponent', () => {
  let component: EmpAddAttendanceComponent;
  let fixture: ComponentFixture<EmpAddAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpAddAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpAddAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

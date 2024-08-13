import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePasswordComponent } from './employee-password.component';

describe('EmployeePasswordComponent', () => {
  let component: EmployeePasswordComponent;
  let fixture: ComponentFixture<EmployeePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeePasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

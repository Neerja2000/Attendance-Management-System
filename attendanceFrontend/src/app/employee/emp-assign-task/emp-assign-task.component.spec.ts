import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAssignTaskComponent } from './emp-assign-task.component';

describe('EmpAssignTaskComponent', () => {
  let component: EmpAssignTaskComponent;
  let fixture: ComponentFixture<EmpAssignTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpAssignTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpAssignTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

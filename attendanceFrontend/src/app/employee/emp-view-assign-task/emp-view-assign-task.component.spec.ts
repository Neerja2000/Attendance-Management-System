import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpViewAssignTaskComponent } from './emp-view-assign-task.component';

describe('EmpViewAssignTaskComponent', () => {
  let component: EmpViewAssignTaskComponent;
  let fixture: ComponentFixture<EmpViewAssignTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpViewAssignTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpViewAssignTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

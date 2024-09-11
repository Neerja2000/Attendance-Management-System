import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpViewTaskComponent } from './emp-view-task.component';

describe('EmpViewTaskComponent', () => {
  let component: EmpViewTaskComponent;
  let fixture: ComponentFixture<EmpViewTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpViewTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpViewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

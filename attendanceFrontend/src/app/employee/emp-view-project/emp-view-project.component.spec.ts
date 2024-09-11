import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpViewProjectComponent } from './emp-view-project.component';

describe('EmpViewProjectComponent', () => {
  let component: EmpViewProjectComponent;
  let fixture: ComponentFixture<EmpViewProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpViewProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpViewProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

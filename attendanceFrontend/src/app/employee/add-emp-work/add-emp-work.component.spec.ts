import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmpWorkComponent } from './add-emp-work.component';

describe('AddEmpWorkComponent', () => {
  let component: AddEmpWorkComponent;
  let fixture: ComponentFixture<AddEmpWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmpWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmpWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

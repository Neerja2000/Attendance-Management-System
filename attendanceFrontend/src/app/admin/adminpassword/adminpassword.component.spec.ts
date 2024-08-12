import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminpasswordComponent } from './adminpassword.component';

describe('AdminpasswordComponent', () => {
  let component: AdminpasswordComponent;
  let fixture: ComponentFixture<AdminpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminpasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpFooterComponent } from './emp-footer.component';

describe('EmpFooterComponent', () => {
  let component: EmpFooterComponent;
  let fixture: ComponentFixture<EmpFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

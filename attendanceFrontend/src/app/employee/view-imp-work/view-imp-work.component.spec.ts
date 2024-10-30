import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImpWorkComponent } from './view-imp-work.component';

describe('ViewImpWorkComponent', () => {
  let component: ViewImpWorkComponent;
  let fixture: ComponentFixture<ViewImpWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewImpWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewImpWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

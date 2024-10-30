import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveImpWorkComponent } from './save-imp-work.component';

describe('SaveImpWorkComponent', () => {
  let component: SaveImpWorkComponent;
  let fixture: ComponentFixture<SaveImpWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveImpWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveImpWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

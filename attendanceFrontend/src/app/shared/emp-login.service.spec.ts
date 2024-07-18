import { TestBed } from '@angular/core/testing';

import { EmpLoginService } from './emp-login.service';

describe('EmpLoginService', () => {
  let service: EmpLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

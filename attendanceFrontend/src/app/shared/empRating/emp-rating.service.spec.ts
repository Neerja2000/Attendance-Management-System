import { TestBed } from '@angular/core/testing';

import { EmpRatingService } from './emp-rating.service';

describe('EmpRatingService', () => {
  let service: EmpRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

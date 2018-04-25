import { TestBed, inject } from '@angular/core/testing';

import { TypeInterestChargeService } from './type-interest-charge.service';

describe('TypeInterestChargeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeInterestChargeService]
    });
  });

  it('should ...', inject([TypeInterestChargeService], (service: TypeInterestChargeService) => {
    expect(service).toBeTruthy();
  }));
});

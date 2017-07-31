import { TestBed, inject } from '@angular/core/testing';

import { BillToPayAmountsPaidService } from './bill-to-pay-amounts-paid.service';

describe('BillToPayAmountsPaidService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillToPayAmountsPaidService]
    });
  });

  it('should ...', inject([BillToPayAmountsPaidService], (service: BillToPayAmountsPaidService) => {
    expect(service).toBeTruthy();
  }));
});

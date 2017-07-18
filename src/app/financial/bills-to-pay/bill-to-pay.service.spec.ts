import { TestBed, inject } from '@angular/core/testing';

import { BillToPayService } from './bill-to-pay.service';

describe('BillToPayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillToPayService]
    });
  });

  it('should ...', inject([BillToPayService], (service: BillToPayService) => {
    expect(service).toBeTruthy();
  }));
});

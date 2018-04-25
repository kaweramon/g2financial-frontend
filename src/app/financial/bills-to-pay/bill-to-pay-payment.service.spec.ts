import { TestBed, inject } from '@angular/core/testing';

import { BillToPayPaymentService } from './bill-to-pay-payment.service';

describe('BillToPayPaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillToPayPaymentService]
    });
  });

  it('should ...', inject([BillToPayPaymentService], (service: BillToPayPaymentService) => {
    expect(service).toBeTruthy();
  }));
});

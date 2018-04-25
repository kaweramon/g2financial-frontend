import { TestBed, inject } from '@angular/core/testing';

import { CieloPaymentService } from './cielo-payment.service';

describe('CieloPaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CieloPaymentService]
    });
  });

  it('should ...', inject([CieloPaymentService], (service: CieloPaymentService) => {
    expect(service).toBeTruthy();
  }));
});

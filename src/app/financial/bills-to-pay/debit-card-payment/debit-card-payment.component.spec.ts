import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitCardPaymentComponent } from './debit-card-payment.component';

describe('DebitCardPaymentComponent', () => {
  let component: DebitCardPaymentComponent;
  let fixture: ComponentFixture<DebitCardPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitCardPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitCardPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

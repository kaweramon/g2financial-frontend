import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BilletPaymentComponent } from './billet-payment.component';

describe('BilletPaymentComponent', () => {
  let component: BilletPaymentComponent;
  let fixture: ComponentFixture<BilletPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BilletPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BilletPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

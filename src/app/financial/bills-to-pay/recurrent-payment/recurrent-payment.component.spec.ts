import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrentPaymentComponent } from './recurrent-payment.component';

describe('RecurrentPaymentComponent', () => {
  let component: RecurrentPaymentComponent;
  let fixture: ComponentFixture<RecurrentPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurrentPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurrentPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

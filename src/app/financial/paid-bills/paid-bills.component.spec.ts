import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidBillsComponent } from './paid-bills.component';

describe('PaidBillsComponent', () => {
  let component: PaidBillsComponent;
  let fixture: ComponentFixture<PaidBillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidBillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

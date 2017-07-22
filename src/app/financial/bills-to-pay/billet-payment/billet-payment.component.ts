import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Address} from './address';

@Component({
  selector: 'app-billet-payment',
  templateUrl: './billet-payment.component.html',
  styleUrls: ['./billet-payment.component.css']
})
export class BilletPaymentComponent {

  public formBilletPayment: FormGroup;

  public formBuilder: FormBuilder;

  public address: Address;

  constructor(private fb: FormBuilder) {
    this.formBuilder = fb;
  }

  public initFormBuilder(): void {
    this.formBilletPayment = this.formBuilder.group({
      'street': [this.address.Street, [Validators.required]],
      'number': [this.address.Number, [Validators.required]]
    });
  }
}

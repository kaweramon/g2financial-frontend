import {Component, Input} from '@angular/core';
import {Payment} from '../payment';
import {CreditCard} from './credit-card';

@Component({
  selector: 'app-credit-card-payment',
  templateUrl: './credit-card-payment.component.html',
  styleUrls: ['./credit-card-payment.component.css']
})
export class CreditCardPaymentComponent {

  public maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public maskSecurityCode = [/[0-9]/, /\d/, /\d/];

  public payment: Payment;

  @Input()
  public totalPayment: number;

  constructor() {
    this.payment = new Payment();
    this.payment.CreditCard = new CreditCard();
  }

}

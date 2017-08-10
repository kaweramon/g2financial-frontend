import {Component, Input} from '@angular/core';
import * as moment from 'moment';
import {BilletShipping} from './billet-shipping';

@Component({
  selector: 'app-billet-payment',
  templateUrl: './billet-payment.component.html',
  styleUrls: ['./billet-payment.component.css']
})
export class BilletPaymentComponent {

  @Input()
  public totalPayment: number;

  @Input()
  public codeBar: string;

  @Input()
  public billetShipping: BilletShipping;

  constructor() {
    // this.billetShipping = new BilletShipping();
  }

  public getMaturityDate(): string {
    return moment().format('DD/MM/YYYY');
  }

}

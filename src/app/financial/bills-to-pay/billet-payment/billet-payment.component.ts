import {Component, Input} from '@angular/core';
import * as moment from 'moment';
import {BilletShipping} from './billet-shipping';
import {Client} from '../../../search-client/client';

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

  @Input()
  public client: Client;

  constructor() {
    // this.billetShipping = new BilletShipping();
  }

  public getCurrentDate(): string {
    return moment().format('DD/MM/YYYY');
  }

  public getMaturityDate(date): string {
    return moment(date).format('DD/MM/YYYY');
  }

}

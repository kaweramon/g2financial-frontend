import {Component, ElementRef, Input} from '@angular/core';
import * as moment from 'moment';
import {BilletShippingService} from './billet-shipping.service';

@Component({
  selector: 'app-billet-payment',
  templateUrl: './billet-payment.component.html',
  styleUrls: ['./billet-payment.component.css']
})
export class BilletPaymentComponent {

  @Input()
  public totalPayment: number;

  constructor(private elementRef:ElementRef) {
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "src/app/financial/bills-to-pay/billet-payment/billet-barcode.js";
    this.elementRef.nativeElement.appendChild(s);
  }

  public getMaturityDate(): string {
    return moment().format('DD/MM/YYYY');
  }

}

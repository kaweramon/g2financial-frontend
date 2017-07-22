import {Component, Input} from '@angular/core';
import {Payment} from '../payment';
import {DebitCard} from './debit-card';
import {BillToPayService} from '../bill-to-pay.service';
import {ToastOptions, ToastyConfig, ToastyService} from 'ng2-toasty';

@Component({
  selector: 'app-debit-card-payment',
  templateUrl: './debit-card-payment.component.html',
  styleUrls: ['./debit-card-payment.component.css']
})
export class DebitCardPaymentComponent {

  public payment: Payment;

  public maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public maskSecurityCode = [/[0-9]/, /\d/, /\d/];

  @Input()
  public totalPayment: number;

  constructor(private service: BillToPayService, private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
    this.payment = new Payment();
    this.payment.DebitCard =  new DebitCard();
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = 'top-right';
  }

  public doPayment(): void {
    this.payment.Type = "DebitCard";
    this.payment.Amount = 5;
    this.payment.ReturnUrl = "http://localhost:4200";
    let debitPayment = {
      MerchantOrderId: "2014121201",
      Payment: this.payment
    };
    this.service.paymentDebitCard(debitPayment).subscribe(result => {
      let toastOptions: ToastOptions = {
        title: "Pagamento Realizado",
        showClose: true,
        timeout: 4000
      };
      this.toastyService.success(toastOptions);
    }, error => {
      console.log(error);
    })
  }

}

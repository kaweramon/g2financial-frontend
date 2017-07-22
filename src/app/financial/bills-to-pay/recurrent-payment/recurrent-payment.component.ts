import {Component, Input} from '@angular/core';
import {Payment} from '../payment';
import {BillToPayService} from '../bill-to-pay.service';
import {ActivatedRoute} from '@angular/router';
import {ClientService} from '../../../search-client/client.service';
import {Client} from '../../../search-client/client';
import * as moment from 'moment';

@Component({
  selector: 'app-recurrent-payment',
  templateUrl: './recurrent-payment.component.html',
  styleUrls: ['./recurrent-payment.component.css']
})
export class RecurrentPaymentComponent {

  @Input()
  public totalPayment: number;

  public payment: Payment;

  public client: Client;

  public maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public maskSecurityCode = [/[0-9]/, /\d/, /\d/];

  constructor(private billToPayService: BillToPayService, private route: ActivatedRoute, private clientService: ClientService) {
    this.payment = new Payment();
    this.getClient();
  }

  private getClient(): void {
    this.clientService.view(this.route.snapshot.params['clientId']).subscribe(client => {
      this.client = client;
    })
  }

  public doPayment(): void {
    this.payment.Type = "CreditCard";
    this.payment.Amount = this.totalPayment;
    this.payment.SoftDescriptor =  "TESTE";
    this.payment.RecurrentPayment.AuthorizeNow = "true";
    this.payment.RecurrentPayment.EndDate = moment().add(1, 'years').format('YYYY-MM-DD');
    this.payment.RecurrentPayment.Interval = "Annual";
    let recurrentPayment = {
      MerchantOrderId: "2014113245231706",
      Customer: {
        Name: this.client.name
      },
      Payment:  this.payment
    };
    this.billToPayService.paymentRecurrentCard(recurrentPayment).subscribe(result => {
      console.log(result);
    }, error => {
      console.log(error);
    })
  }

}

import {Component, ElementRef, Input} from '@angular/core';
import * as moment from 'moment';
import {BilletShipping} from './billet-shipping';
import {Client} from '../../../search-client/client';
import {ActivatedRoute} from '@angular/router';
import {BilletShippingService} from './billet-shipping.service';
import {ClientService} from '../../../search-client/client.service';

@Component({
  selector: 'app-billet-payment',
  templateUrl: './billet-payment.component.html',
  styleUrls: ['./billet-payment.component.css']
})
export class BilletPaymentComponent {

  @Input()
  public billetShipping: BilletShipping;

  @Input()
  public client: Client;

  public codeBar: string = "";

  constructor(private elementRef: ElementRef, private route: ActivatedRoute, private billetService: BilletShippingService,
              private clientService: ClientService) {
    billetService.getBilletById(this.route.snapshot.params["billetId"]).subscribe(result => {
      this.billetShipping = result;
      this.billetShipping.isCancel = false;
      this.billetShipping.partialPayment = "NAO";
      if (this.billetShipping !== null && this.billetShipping !== undefined) {
        clientService.view(this.billetShipping.clientId).subscribe(client => {
          this.client = client;
          // this.generateCodeBarCaixa(this.generateQrCode(this.print()));
        });
      }
    });
  }

  public getMaturityDate(date): string {
    return moment(date).add(1, 'd').format('DD/MM/YYYY');
  }

  public getCurrentDate(): string {
    return moment().format('DD/MM/YYYY');
  }

}

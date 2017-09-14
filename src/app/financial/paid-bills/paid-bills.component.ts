import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BillToPayService} from '../bills-to-pay/bill-to-pay.service';
import * as moment from 'moment';

@Component({
  selector: 'app-paid-bills',
  templateUrl: './paid-bills.component.html',
  styleUrls: ['./paid-bills.component.css']
})
export class PaidBillsComponent implements OnInit {

  public listPaidBills: Array<any> = [];

  public listBillToPayPayment: Array<any> = [];

  constructor(private route: ActivatedRoute, private service: BillToPayService) { }

  public page: any;

  ngOnInit() {
    this.service.listByClientId(this.route.snapshot.params['clientId'], "SIM").subscribe(result => {
      this.listPaidBills = result;
      // this.getListBillToPayPayment();
    });
  }

  private getListBillToPayPayment(): void {
    this.listPaidBills.forEach(billToPay => {
      if (billToPay.listBillToPayPayment !== null && billToPay.listBillToPayPayment.length > 0) {
        billToPay.listBillToPayPayment.forEach(billToPayPayment => {
          billToPayPayment.description = billToPay.description;
          billToPayPayment.isChecked = false;
          this.listBillToPayPayment.push(billToPayPayment);
        });
      }
    });
  }

  public getConvertedDate(date: any) {
    return moment(date).format('DD/MM/YYYY');
  }


}

import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BillToPayService} from './bill-to-pay.service';
import {BillToPay} from './bill-to-pay';
import * as moment from 'moment';

@Component({
  selector: 'app-bills-to-pay',
  templateUrl: './bills-to-pay.component.html',
  styleUrls: ['./bills-to-pay.component.css']
})
export class BillsToPayComponent {

  public listBillToPay: Array<BillToPay>;

  public listBillToPayPayment: Array<any> = [];

  public listSelectedBillToPayPayment: Array<any> = [];

  public isPaymentSelected = false;

  public totalPayment = 0 ;

  public maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public maskSecurityCode = [/[0-9]/, /\d/, /\d/];

  public paymentMethod = '';

  constructor(private route: ActivatedRoute, private service: BillToPayService) {
    this.service.listByClientId(this.route.snapshot.params["clientId"], 'NAO').subscribe(result => {
      this.listBillToPay = result;
      this.getListBillToPayPayment();
    });
  }

  private getListBillToPayPayment(): void {
    this.listBillToPay.forEach(billToPay => {
      if (billToPay.listBillToPayPayment !== null && billToPay.listBillToPayPayment.length > 0) {
        billToPay.listBillToPayPayment.forEach(billToPayPayment => {
          billToPayPayment.description = billToPay.description;
          billToPayPayment.isChecked = false;
          this.listBillToPayPayment.push(billToPayPayment);
        });
      }
    });
  }

  public payBills(): void {
    this.isPaymentSelected = true;
    this.listBillToPayPayment.forEach(billToPayPayment => {
      if (billToPayPayment.isChecked) {
        billToPayPayment.subTotal = billToPayPayment.amountPaid + billToPayPayment.interest;
        this.totalPayment += billToPayPayment.subTotal;
        this.listSelectedBillToPayPayment.push(billToPayPayment);
      }
    });
  }

  public getConvertedDate(date: any) {
    return moment(date).add(1, 'd').format('DD/MM/YYYY');
  }

  public isDateLessOrEqualThanToday(billToPayPayment: any): string {
    if (billToPayPayment.maturity === (moment().subtract(1, 'd').format('YYYY-MM-DD'))) {
      billToPayPayment.isChecked = true;
      return 'IS_SAME';
    }
    if (moment(billToPayPayment.maturity).isBefore(moment().subtract(1, 'd'))) {
      billToPayPayment.isChecked = true;
      return 'IS_BEFORE';
    }
  }

  public changePaymentMethod(method: string): void {
    this.paymentMethod = method;
  }

}

import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BillToPayService} from './bill-to-pay.service';
import {BillToPay} from './bill-to-pay';
import * as moment from 'moment';
import {Payment} from './payment';
import {CreditCard} from './credit-card-payment/credit-card';
import {TypeInterestChargeService} from '../type-interest-charge.service';
import {TypeInterestCharge} from '../type-interest-charge';
import {BillToPayPayment} from './bill-to-pay-payment';

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

  public payment: Payment;

  public typeInterestCharge: TypeInterestCharge;

  constructor(private route: ActivatedRoute, private service: BillToPayService, private typeInterestService: TypeInterestChargeService) {
    this.payment = new Payment();
    this.paymentMethod = 'RECURRENT_CREDIT';
    this.service.listByClientId(this.route.snapshot.params["clientId"], 'NAO').subscribe(result => {
      this.listBillToPay = result;
      this.getListBillToPayPayment();
    });
    this.typeInterestService.getByType('MENSALIDADE').subscribe(result => {
      this.typeInterestCharge = result;
    })
  }

  private getListBillToPayPayment(): void {
    this.listBillToPay.forEach(billToPay => {
      if (billToPay.listBillToPayPayment !== null && billToPay.listBillToPayPayment.length > 0) {
        billToPay.listBillToPayPayment.forEach(billToPayPayment => {
          billToPayPayment.description = billToPay.description;
          billToPayPayment.isChecked = false;
          this.calculateInterests(billToPayPayment);
          this.listBillToPayPayment.push(billToPayPayment);
        });
      }
    });
  }

  public payBills(): void {
    this.isPaymentSelected = true;
    this.listBillToPayPayment.forEach(billToPayPayment => {
      if (billToPayPayment.isChecked) {
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

  public doPayment(): void {

    if (this.paymentMethod === 'CREDIT') {
      this.payment.Type = "CreditCard";
      this.payment.Installments = parseInt(this.payment.Installments.toString());
    } else if(this.paymentMethod === 'DEBIT') {
      this.payment.Type = "DebitCard";
    }
    this.payment.Amount = 5;
    this.payment.SoftDescriptor = "TESTE";

    let test = {
      MerchantOrderId:"2014111703",
      Customer: {
        Name: "Teste"
      },
      Payment: this.payment
    };
    this.service.paymentCreditCard(test).subscribe(result => {
      console.log(result);
    }, error => {
      console.log(error);
    })
  }

  private calculateInterests(billToPayment: BillToPayPayment): void {
    billToPayment.amountInterest = (billToPayment.amount / 100) * 1;
    let year = moment(billToPayment.maturity).add(1, 'd').year();
    let month = moment(billToPayment.maturity).add(1, 'd').month();
    let day = moment(billToPayment.maturity).add(1, 'd').date();
    let now = moment();
    let monthInArrears = parseInt(moment([now.year(), now.month(), now.date()]).diff(moment([year, month, day]), 'months', true).toString(), 10);
    let daysInArrears = parseInt(moment().diff(moment(billToPayment.maturity).add(1, 'd'), 'days').toString(), 10);
    billToPayment.daysInArrears = daysInArrears;
    let chargesInDayMonths: Array<number> = [];
    if (daysInArrears !== undefined && daysInArrears > 0) {
      billToPayment.amountInterest = (billToPayment.amount / 100) * this.typeInterestCharge.percentInterest;
      billToPayment.amountCharges = 0.0;
      for (let i = 0; i < daysInArrears; i++) {
        billToPayment.amountCharges += (billToPayment.amount / 100) * this.typeInterestCharge.percentCharges;
        if (monthInArrears !== undefined && monthInArrears > 0 && i > 28 && moment(billToPayment.maturity).add(i + 1, 'd').date() === day) {
          chargesInDayMonths.push(billToPayment.amountCharges);
        }
      }
      billToPayment.amountLiveDays = 0.0;
      if (chargesInDayMonths.length > 0) {
        billToPayment.amountLiveDays =  ((billToPayment.amount / 100) * (this.typeInterestCharge.percentLiveDays * billToPayment.daysInArrears));
      }
      billToPayment.subTotal = billToPayment.amount + billToPayment.amountInterest + billToPayment.amountLiveDays + billToPayment.amountCharges;
    }
  }z

}

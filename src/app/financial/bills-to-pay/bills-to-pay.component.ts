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
import {BilletShippingService} from './billet-payment/billet-shipping.service';
import {BilletShipping} from './billet-payment/billet-shipping';

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

  constructor(private route: ActivatedRoute, private service: BillToPayService,
              private typeInterestService: TypeInterestChargeService, private billetShippingService: BilletShippingService) {
    this.payment = new Payment();
    //TODO: remover
    this.paymentMethod = 'BILLET';
    // this.isPaymentSelected = true;
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
          this.isDateLessOrEqualThanToday(billToPayPayment);
          this.calculateInterests(billToPayPayment);
          this.listBillToPayPayment.push(billToPayPayment);
        });
      }
    });
  }

  public payBills(): void {
    this.isPaymentSelected = true;
    this.listSelectedBillToPayPayment = [];
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

  public isDateLessOrEqualThanToday(billToPayPayment: any): void {
    billToPayPayment.isChecked = false;
    if (billToPayPayment.maturity === (moment().subtract(1, 'd').format('YYYY-MM-DD'))) {
      billToPayPayment.isChecked = true;
      billToPayPayment.dateStatus = 'IS_SAME';
    }
    if (moment(billToPayPayment.maturity).isBefore(moment().subtract(1, 'd'))) {
      billToPayPayment.isChecked = true;
      billToPayPayment.dateStatus = 'IS_BEFORE';
    }
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
    } else {
      billToPayment.subTotal = billToPayment.amount;
    }
  }

  public generateBillet(): void {
    let billetShipping = new BilletShipping();
    let ourNumber = "";
    this.billetShippingService.getLastCounter().subscribe(result => {
      let nextCounter = result + 1;
      billetShipping.counter = nextCounter;
      console.log((12 - nextCounter.toString().length));
      for (let i = 0; i < (12 - nextCounter.toString().length); i++) {
        ourNumber += "0";
      }
      ourNumber += nextCounter.toString();
      console.log(ourNumber);
      //Calculo do digito Santander
      let ourNumberArrayInverted = ourNumber.split("").reverse().join("");
      let total = 0;
      console.log("inverted: " + ourNumberArrayInverted);
      for (let j = 0; j < ourNumberArrayInverted.length; j++) {
        if (j < 8) {
          total += (parseInt(ourNumberArrayInverted[j]) * (j + 2));
        } else if (j === 8) {
          total += (parseInt(ourNumberArrayInverted[j]) * 2);
        } else if (j === 9) {
          total += (parseInt(ourNumberArrayInverted[j]) * 3);
        } else if (j === 10) {
          total += (parseInt(ourNumberArrayInverted[j]) * 4);
        } else if (j === 11) {
          total += (parseInt(ourNumberArrayInverted[j]) * 5);
        }
      }
      let rest = (total / 11).toString().split(".")[1].split("")[0];
      let digit = 11 - parseInt(rest);
      ourNumber += "-" + digit;
      console.log(ourNumber);
      billetShipping.ourNumber = ourNumber;
      billetShipping.billValue = this.totalPayment;
      billetShipping.clientId = this.route.snapshot.params["clientId"];
      billetShipping.isCancel = false;
      let paymentTypes = "";
      for (let i = 0; i < this.listSelectedBillToPayPayment.length; i++) {
        if (i < this.listSelectedBillToPayPayment.length - 1) {
          paymentTypes += this.listSelectedBillToPayPayment[i].description + ", ";
        } else {
          paymentTypes += this.listSelectedBillToPayPayment[i].description;
        }
      }
      billetShipping.chargingType = paymentTypes;
      billetShipping.partialPayment = "NAO";
      this.billetShippingService.create(billetShipping).subscribe(result => {
        console.log(result);
      }, error => {
        console.log(error);
      })
    }, error => {
      console.log(error);
    });
  }

  public printBillet(): void {
    // tablebillet
    let printContents, popupWin;
    printContents = document.getElementById('tablebillet').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <style>
          .logo{
  text-align: center; height: 10mm; border-right: 1mm solid #000000; border-bottom: 1mm solid #000000
}
.logo{
  text-align: center; height: 10mm; border-right: 1mm solid #000000; border-bottom: 1mm solid #000000
}
.bankCode {
  font-size: 5mm; font-family: arial, verdana; font-weight : bold;
  font-style: italic; text-align: center; vertical-align: bottom;
  padding-right: 1mm; border-right: 1mm solid #000000; border-bottom: 1mm solid #000000
}
.bankCode2 {
  font-size: 5mm; font-family: arial, verdana; font-weight : bold;
  font-style: italic; text-align: center; vertical-align: bottom;
  /*border-bottom: 1.2mm solid #000000; border-right: 1.2mm solid #000000;*/
}
.billetNumber {
  font-size: 5mm; font-family: arial, verdana; font-weight : bold;
  text-align: center; vertical-align: bottom; padding-bottom : 1mm;
}
.billetRightHeader {
  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm; border-bottom: 1mm solid #000000
}
.billetRightHeader2 {
  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;
}
.billetRightField {
  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm; border-left: 0.15mm solid #000000;
}
.billetLeftField2 {
  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm; border-left: 0.15mm solid #000000;
}
.billetLeftField {
  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;
}
.billetLeftValue {
  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;
}
.billetLeftValue2 {
  font-size: 3mm; font-family: arial, verdana; padding-left : 1mm;
  text-align: center; font-weight: bold; border-left: 0.15mm solid #000000;
  border-bottom: 0.15mm solid #000000;
}
.billetRightTextValue {
  font-size: 3mm; font-family: arial, verdana; text-align:right;
  padding-right: 1mm; font-weight: bold; border-left: 0.15mm solid #000000;
  border-bottom: 0.15mm solid #000000;
}
.tr-border-bottom {
  border-bottom: 0.15mm solid #000000;
}

</style>
          <title>Comprovante</title>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }




}

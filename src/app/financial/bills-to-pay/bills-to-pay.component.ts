import {Component, ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BillToPayService} from './bill-to-pay.service';
import {BillToPay} from './bill-to-pay';
import * as moment from 'moment';
import {Payment} from './payment';
import {TypeInterestChargeService} from '../type-interest-charge.service';
import {TypeInterestCharge} from '../type-interest-charge';
import {BillToPayPayment} from './bill-to-pay-payment';
import {BilletShippingService} from './billet-payment/billet-shipping.service';
import {BilletShipping} from './billet-payment/billet-shipping';
import * as $ from 'jquery';

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

  public ourNumber: string = "";

  public codeBar: string = "";

  public billetShipping: BilletShipping;

  constructor(private route: ActivatedRoute, private service: BillToPayService, private elementRef:ElementRef,
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
    });
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
    for (let i = 0; i < this.listBillToPayPayment.length; i++) {
      let billToPayPayment = this.listBillToPayPayment[i];
      if (billToPayPayment.isChecked) {
        this.totalPayment += billToPayPayment.subTotal;
        this.listSelectedBillToPayPayment.push(billToPayPayment);
      }
      if (i == this.listBillToPayPayment.length - 1) {
        this.generateCodeBar();
      }
    }
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
    $('#btnGenerateBillet').prop('disabled', true);
    this.billetShippingService.getLastCounter().subscribe(result => {
      let nextCounter = result + 1;
      this.billetShipping = new BilletShipping();
      this.billetShipping.counter = nextCounter;
      for (let i = 0; i < (12 - nextCounter.toString().length); i++) {
        this.ourNumber += "0";
      }
      this.ourNumber += nextCounter.toString();
      //Calculo do digito Santander
      let ourNumberArrayInverted = this.ourNumber.split("").reverse().join("");
      let total = 0;
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
      let rest = "0";
      if ((total / 11).toString().indexOf(".") !== -1) {
        rest = (total / 11).toString().split(".")[1].split("")[0];
      }
      let digit = 11 - parseInt(rest);
      this.ourNumber += "-" + digit;
      this.billetShipping.ourNumber = this.ourNumber;
      this.billetShipping.billValue = this.totalPayment;
      this.billetShipping.clientId = this.route.snapshot.params["clientId"];
      this.billetShipping.isCancel = false;
      let paymentTypes = "";
      for (let i = 0; i < this.listSelectedBillToPayPayment.length; i++) {
        if (i < this.listSelectedBillToPayPayment.length - 1) {
          paymentTypes += this.listSelectedBillToPayPayment[i].description + ", ";
        } else {
          paymentTypes += this.listSelectedBillToPayPayment[i].description;
        }
      }
      this.billetShipping.chargingType = paymentTypes;
      this.billetShipping.partialPayment = "NAO";
      this.billetShipping.documentNumber = this.ourNumber.substring(
        this.ourNumber.length - 7, this.ourNumber.length - 2);
      this.billetShippingService.create(this.billetShipping).subscribe(result => {
        console.log(JSON.stringify(result));
      }, error => {
        console.log(error);
      });
      this.generateQrBarCode();
    }, error => {
      console.log(error);
    });
  }

  private generateCodeBar(): void {
    // Primeiro Grupo
    let codeBarFirstGroup = "033998548";
    let codeBarFirstGroupInverted = codeBarFirstGroup.split("").reverse().join("");
    let total = 0;
    for (let i = 0; i < codeBarFirstGroupInverted.length;i++) {
      let currentNumber = parseInt(codeBarFirstGroupInverted[i]);
      if (i == 4 && currentNumber == 9) {
        total += currentNumber;
      } else {
        if (i % 2 == 0) {
          if (currentNumber * 2 > 10) {
            let firstDigit: number = parseInt((currentNumber * 2).toString().split("")[0].toString());
            let secondDigit: number = parseInt((currentNumber * 2).toString().split("")[1].toString());
            total += (firstDigit + secondDigit);
          } else {
            total += currentNumber * 2;
          }
        } else {
          total += currentNumber;
        }
      }
    }
    let digitRest = parseInt((total / 10).toString().split(".")[1]);
    codeBarFirstGroup += "." + (10 - digitRest);
    // Segundo Grupo
    let codeBarSecondGroup = "862" + this.ourNumber.substr(0, 7);
    let codeBarSecondGroupInverted = codeBarSecondGroup.split("").reverse().join("");
    let totalSecondGroup = 0;
    for (let j = 0 ; j < codeBarSecondGroupInverted.length; j++) {
      let currentNumber = parseInt(codeBarSecondGroupInverted[j]);
      if (j % 2 == 0) {
        totalSecondGroup += currentNumber * 2;
      } else {
        totalSecondGroup += currentNumber;
      }
    }
    let digitRestSecondGroup = parseInt((totalSecondGroup / 10).toString().split(".")[1]);
    codeBarSecondGroup += "." + (10 - digitRestSecondGroup);
    //Terceiro Grupo
    let codeBarThirdGroup = this.ourNumber.substr(7, 14);
    codeBarThirdGroup = codeBarThirdGroup.replace(/-/g, "");
    codeBarThirdGroup += "0101";
    let codeBarThirdGroupInverted = codeBarThirdGroup.split("").reverse().join("");
    let totalThirdGroup = 0;
    for (let k = 0; k < codeBarThirdGroupInverted.length; k++) {
      let currentNumberThirdGroup = parseInt(codeBarThirdGroupInverted[k]);
      if (k % 2 == 0) {
        totalThirdGroup += currentNumberThirdGroup * 2;
      } else {
        totalThirdGroup += currentNumberThirdGroup;
      }
    }
    let restDigitThirdGroup = (totalThirdGroup / 10).toString().split(".")[1] !== undefined ?
      parseInt((totalThirdGroup / 10).toString().split(".")[1]): 0;
    restDigitThirdGroup = restDigitThirdGroup !== NaN ? restDigitThirdGroup: 0;
    codeBarThirdGroup +=  "." + (10 - restDigitThirdGroup);
    // Quarto Grupo - Digito Verificador
    let factorMaturity = moment().diff(moment("1997-10-07"), 'days');
    // Numero PSK (Codigo G2) = 8548862
    // calcular valor nominal (10 digitos)
    let valueStr = (this.totalPayment.toFixed(2)).replace(/([.*+?^$|(){}\[\]-])/mg, "");
    let nominalValue = "";
    for (let y = 0; y < (10 - valueStr.length); y++) {
      nominalValue += "0";
    }
    nominalValue += valueStr;
    let verifyDigitStr = "0339" + factorMaturity + nominalValue + "9" +
      "8548862" + this.ourNumber + "0" + "101";
    verifyDigitStr = verifyDigitStr.replace(/([.*+?^$|(){}\[\]-])/mg, "");
    let verifyDigitStrInverted = verifyDigitStr.split("").reverse().join("");
    let totalFourthGroup = 0;
    let numberToCalc = 2;
    for (let p = 0; p < verifyDigitStrInverted.length; p++) {
      totalFourthGroup += parseInt(verifyDigitStrInverted[p]) * numberToCalc;
      numberToCalc++;
      if (p == 7 || p == 15 || p == 23 || p == 31 || p == 39) {
        numberToCalc = 2;
      }
    }
    console.log(totalFourthGroup);
    let verifyDigit = ((totalFourthGroup * 10) / 11).toString().split(".")[1];
    let numberVerifyDigit = 0;
    console.log(verifyDigit);
    if (verifyDigit !== undefined) {
      if (verifyDigit.split("").length > 1) {
        if (parseInt(verifyDigit.split("")[1]) > 5){
          numberVerifyDigit = parseInt(verifyDigit.split("")[0]) + 1;
        } else {
          numberVerifyDigit = parseInt(verifyDigit.split("")[0]);
        }
      } else {
        numberVerifyDigit = parseInt(verifyDigit.split("")[0]);
      }
    }
    // Quinto Grupo -> Fator de Vencimento e Valor Nominal
    let codeBarFifthGroup = factorMaturity + nominalValue;
    this.codeBar = codeBarFirstGroup + " " + codeBarSecondGroup + " " + codeBarThirdGroup + " " + numberVerifyDigit + " " + codeBarFifthGroup;
    console.log("Código de Barras: " + this.codeBar);
  }

  private generateQrBarCode(): void {
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "src/app/financial/bills-to-pay/billet-payment/billet-barcode.js";
    this.elementRef.nativeElement.appendChild(s);
    setTimeout(() => {
      this.printBillet();
    }, 2000);
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

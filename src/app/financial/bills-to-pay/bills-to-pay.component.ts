import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BillToPayService} from './bill-to-pay.service';
import {BillToPay} from './bill-to-pay';
import * as moment from 'moment';
import {Payment} from './payment';
import {TypeInterestChargeService} from '../type-interest-charge.service';
import {TypeInterestCharge} from '../type-interest-charge';
import {BillToPayPayment} from './bill-to-pay-payment';
import {BilletShipping} from './billet-payment/billet-shipping';
import * as $ from 'jquery';
import {ClientService} from '../../search-client/client.service';
import {Client} from '../../search-client/client';

@Component({
  selector: 'app-bills-to-pay',
  templateUrl: './bills-to-pay.component.html',
  styleUrls: ['./bills-to-pay.component.css']
})
export class BillsToPayComponent {

  public listBillToPayPayment: Array<any> = [];

  public listSelectedBillToPayPayment: Array<any> = [];

  public isPaymentSelected = false;

  public totalPayment = 0 ;

  public paymentMethod = '';

  public payment: Payment;

  public typeInterestCharge: TypeInterestCharge;

  public ourNumber: string = "";

  public codeBar: string = "";

  public billetShipping: BilletShipping;

  public billetGenerated: boolean = false;

  public client: Client = new Client();

  constructor(private route: ActivatedRoute, private service: BillToPayService, private elementRef:ElementRef,
              private typeInterestService: TypeInterestChargeService, private clientService: ClientService) {
    this.payment = new Payment();
    //TODO: remover
    this.paymentMethod = 'BILLET';
    this.clientService.view(this.route.snapshot.params["clientId"]).subscribe(client => {
      this.client = client;
    });
    this.typeInterestService.getByType('MENSALIDADE').subscribe(result => {
      this.typeInterestCharge = result;
    });
    this.service.listByClientId(this.route.snapshot.params["clientId"], 'NAO').subscribe(result => {
      this.listBillToPayPayment = result;
      if (this.listBillToPayPayment !== undefined && this.listBillToPayPayment.length > 0) {
        this.listBillToPayPayment.forEach(billToPayPayment => {
          this.isDateLessOrEqualThanToday(billToPayPayment);
          this.calculateInterests(billToPayPayment);
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
    let monthInArrears = parseInt(moment([now.year(), now.month(), now.date()]).diff(moment([year, month, day]),
      'months', true).toString(), 10);
    let daysInArrears = parseInt(moment().diff(moment(billToPayment.maturity).add(1, 'd'),
      'days').toString(), 10);
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

  public generateBillet(billetShipping: BilletShipping): void {
    document.getElementById('ifrOutput').style.display = 'block';
    $('#btnPrintBillet_' + billetShipping.id).prop('disabled', true);
    this.billetShipping = Object.assign({}, billetShipping);
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
    this.codeBar = "";
    // this.printBillet();
    this.generateCodeBarCaixa(this.generateQrCode(this.print()));
    /*setTimeout(() => {
      this.billetGenerated = true;
      this.generateQrBarCode();
      // this.printBillet();
    }, 500);*/
  }

  private generateCodeBarCaixa(callback): void {
    // Posição 1-3 -> Identificação do banco (104)
    // Posição 4 -> Código da moeda (9 - Real)
    // TODO: Posição 5 -> DV Geral do Código de Barras
    let codeBarToReturn: string = "";
    // Posição 06 - 09 -> Fator de Vencimento
    let maturityFactor = this.getMaturityFactor(this.billetShipping.maturityDate);
    let billetValueCalculated = this.getBilletCodeBarValue(this.billetShipping.billValue).toString();
    // 20 – 25 6 9 (6) Código do Beneficiário
    let benefictCode = "377192";
    // 26 – 26 1 9 (1) DV do Código do Beneficiário
    let dvBenefictCode = this.getVerifyDigitBeneficiaryCode(benefictCode);
    // 27 – 29 3 9 (3) Nosso Número - Seqüência 1
    codeBarToReturn += this.billetShipping.ourNumber.substring(0, 2);
    // 30 – 30 1 9 (1) Constante 1
    codeBarToReturn += "1";
    // 31 – 33 3 9 (3) Nosso Número - Seqüência 2
    codeBarToReturn += this.billetShipping.ourNumber.substring(3, 5);
    // 34 – 34 1 9 (1) Constante 2
    codeBarToReturn += "4";
    // 35 – 43 9 9 (9) Nosso Número - Seqüência 3
    codeBarToReturn += this.billetShipping.ourNumber.substring(6, this.billetShipping.ourNumber.length - 1);
    // 44 – 44 1 9 (1) DV do Campo Livre
    // Código do beneficiário -> 377192
    let dvFreeCamp = this.getFreeCampCodeBar("377192", dvBenefictCode.toString(), this.billetShipping.ourNumber);
    let generalVerifyDigit = this.getVerifyDigitGeneral(maturityFactor, billetValueCalculated, benefictCode,
      dvBenefictCode.toString(), this.billetShipping.ourNumber, dvFreeCamp);
    let field1 = "1049" + benefictCode.charAt(0) + "." + benefictCode.substring(1,5) +
      this.getVerifyDigitFields123("1049" + benefictCode.charAt(0) + benefictCode.substring(1,5));
    let field2 = benefictCode.charAt(benefictCode.length - 1) + dvBenefictCode + this.billetShipping.ourNumber.substring(0,3)
      + ".1" + this.billetShipping.ourNumber.substring(3,6) + "4" +
      this.getVerifyDigitFields123(benefictCode.charAt(benefictCode.length - 1) + dvBenefictCode +
        this.billetShipping.ourNumber.substring(0,3) + "1" + this.billetShipping.ourNumber.substring(3,6) + "4");
    let field3 = this.billetShipping.ourNumber.substring(6, 11) + "." +
      this.billetShipping.ourNumber.substring(11, this.billetShipping.ourNumber.length) + dvFreeCamp +
      this.getVerifyDigitFields123(this.billetShipping.ourNumber.substring(6, 11) +
        this.billetShipping.ourNumber.substring(11, this.billetShipping.ourNumber.length) + dvFreeCamp);

    codeBarToReturn = field1 + " " + field2 + " " + field3 + " " + generalVerifyDigit + " " + maturityFactor + billetValueCalculated;

    this.billetShipping.ourNumber = "14" + this.billetShipping.ourNumber + "-" +
      this.getVerifyDigitOurNumber("14" + this.billetShipping.ourNumber);

    this.codeBar = codeBarToReturn;
    if (callback) {
      callback();
    }
  }

  // CÁLCULO DO DÍGITO VERIFICADOR DA LINHA DIGITÁVEL (CAMPOS 1, 2 E 3)
  private getVerifyDigitFields123(strToCalc: string): number {
    let toReturn: number = 0;
    let total: number = 0;
    strToCalc = strToCalc.split("").reverse().join("");
    for (let i = 0; i < strToCalc.length; i++) {
      if ( i % 2 == 0 || i == 0) {
        if ((parseInt(strToCalc[i]) * 2).toString().split("").length == 2) {
          let alg1 = parseInt((parseInt(strToCalc[i]) * 2).toString().split("")[0]);
          let alg2 = parseInt((parseInt(strToCalc[i]) * 2).toString().split("")[1]);
          total += (alg1 + alg2);
        } else {
          total += parseInt(strToCalc[i]) * 2;
        }
      } else {
        total += parseInt(strToCalc[i]);
      }
    }
    if (total < 10) {
      toReturn = 10 - total;
    }
    let restAux = (total / 10).toString().split(".");
    let rest;
    if (restAux[1] !== undefined) {
      // rest = parseInt(restAux[1].split("")[restAux[1].split("").length-1]);
      rest = (parseInt(restAux[1].split("")[0]) + 1);
    } else {
      rest = 0;
    }

    if (rest == 0) {
      toReturn = 0;
    } else {
      toReturn = 10 - rest;
    }
    return toReturn;
  }

  //  CALCULO DO DÍGITO VERIFICADOR GERAL DO CÓDIGO DE BARRAS
  private getVerifyDigitGeneral(maturityFactor: string, billetValue: string, benefictCode: string, dvBenefictCode: string,
                                ourNumber: string, dvFreeCamp: number): number {
    let toReturn: number;
    let calcStrArray = ("1049" + maturityFactor + billetValue + benefictCode + dvBenefictCode + ourNumber.substring(0,3)
      + "1" + ourNumber.substring(3,6) + "4" + ourNumber.substring(6 , ourNumber.length) + dvFreeCamp).split("");
    let total: number = 0;
    for (let i = 0; i < calcStrArray.length; i++) {
      if (i == 0 || i == 8 || i == 16 || i == 24 || i == 32 || i == 40) {
        total += parseInt(calcStrArray[i]) * 4;
      }
      if (i == 1 || i == 9 || i == 17 || i == 25 || i == 33 || i == 41) {
        total += parseInt(calcStrArray[i]) * 3;
      }
      if (i == 2 || i == 10 || i == 18 || i == 26 || i == 34 || i == 42) {
        total += parseInt(calcStrArray[i]) * 2;
      }
      if (i == 3 || i == 11 || i == 19 || i == 27 || i == 35 || i == 43) {
        total += parseInt(calcStrArray[i]) * 9;
      }
      if (i == 4 || i == 12 || i == 20 || i == 28 || i == 36) {
        total += parseInt(calcStrArray[i]) * 8;
      }
      if (i == 5 || i == 13 || i == 21 || i == 29 || i == 37) {
        total += parseInt(calcStrArray[i]) * 7;
      }
      if (i == 6 || i == 14 || i == 22 || i == 30 || i == 38) {
        total += parseInt(calcStrArray[i]) * 6;
      }
      if (i == 7 || i == 15 || i == 23 || i == 31 || i == 39) {
        total += parseInt(calcStrArray[i]) * 5;
      }
    }
    let restAux = (total / 11).toString().split(".");
    let rest: number;
    if (restAux[1] === undefined) {
      toReturn = 1;
    } else {
      rest = (parseInt(restAux[1].split("")[0]) + 1);
      // rest = parseInt(restAux[1].split("")[restAux[1].split("").length-1]);
    }

    if (rest !== undefined) {
      if ((11 - rest) > 9) {
        toReturn = 1;
      } else {
        toReturn = 11 - rest;
      }
    }

    return toReturn;
  }

  // Cálculo do fator de vencimento Posição: 06-09 - CAIXA
  private getMaturityFactor(date: any): any {
    return moment(date).diff(moment("1997-10-07"), 'days');
  }

  // Cálculo do digito verificador do código do beneficiário - CAIXA
  private getVerifyDigitBeneficiaryCode(beneficiaryCode: string): number {
    let toReturn: number;
    let beneficiaryCodeInverted = beneficiaryCode.split("").reverse().join("");
    let total: number = 0;
    for (let i = 0; i < beneficiaryCodeInverted.length; i++) {
      total += (parseInt(beneficiaryCodeInverted[i]) * (i + 2));
    }
    let rest: number = 0;
    if (total >= 11) {
      let restAux = (total / 11).toString().split(".");
      rest = parseInt(restAux[1].split("")[restAux[1].split("").length-1]);
      toReturn = (11 - rest);
    } else {
      toReturn = (11 - total);
    }
    if (toReturn > 9) {
      return 0;
    }
    return toReturn;
  }

  // CAMPO LIVRE DO CÓDIGO DE BARRAS
  private getFreeCampCodeBar(beneficCode: string, dvBenefictCode: string, ourNumber: string): number {
    let result: number;
    let strCalcFreeCamp = beneficCode + dvBenefictCode + ourNumber.substring(0,3) + "1" + ourNumber.substring(3,6) + "4" +
      ourNumber.substring(6 , ourNumber.length);
    let strInverted = strCalcFreeCamp.split("").reverse().join("");
    let multiplicationIndex: number = 2;
    let total: number = 0;
    for (let i = 0; i < strInverted.length; i++) {
      if (i == 8 || i == 16) {
        multiplicationIndex = 2;
      }
      total += (parseInt(strInverted[i])) * multiplicationIndex;
      multiplicationIndex++;
    }
    if (total < 11) {
      result = total - 11;
    } else {
      let divisionResult = (total / 11).toString().split(".");
      let rest: number;
      if (divisionResult[1] !== undefined) {
        if (divisionResult[1].split("").length > 1) {
          // parseInt(restAux[1].split("")[restAux[1].split("").length-1]);
          // rest = parseInt(divisionResult[1].split("")[0]) + 1;
          rest = parseInt(divisionResult[1].split("")[divisionResult[1].split("").length-1]);
        } else {
          rest = (parseInt(divisionResult[1].split("")[0]));
        }
      } else {
        rest = 0;
      }
      result = 11 - rest;
    }
    if (result > 9) {
      result = 0;
    }
    return result;
  }

  // Cálculo do valor (Posição: 10-19) - CAIXA
  private getBilletCodeBarValue(billValue: number): string {
    let toReturn: string = "";
    let cleanValueStr: string = "";
    if (billValue.toString().indexOf(".") == -1 && billValue.toString().indexOf(",") == -1) {
      for (let i = 0; i < (8 - billValue.toString().length);i++) {
        toReturn += "0";
      }
      toReturn += billValue;
      toReturn += "00";
    } else {
      cleanValueStr = billValue.toString().replace(".", "").replace(",", "");
      for (let i = 0; i < (10 - cleanValueStr.length); i++) {
        toReturn += "0";
      }
      toReturn += cleanValueStr;
    }
    return toReturn;
  }

  private getVerifyDigitOurNumber(ourNumber: string): number {
    let toReturn: number;

    let ourNumberInverted = ourNumber.split("").reverse().join("");

    let total = 0;
    let multiplicationIndex = 2;
    for (let i = 0; i < ourNumberInverted.length; i++) {
      if (i == 8 || i == 16) {
        multiplicationIndex = 2;
      }
      total += parseInt(ourNumberInverted[i]) * multiplicationIndex;
      multiplicationIndex++;
    }
    let rest: number;
    let restAux = (total / 11).toString().split(".");
    rest = ((parseInt(restAux[1].split("").pop())) + 1);
    if ((11 - rest) > 9) {
      toReturn = 0;
    } else {
      toReturn = 11 - rest;
    }
    return toReturn;
  }

  private generateQrCode(callback): void {
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "src/app/financial/bills-to-pay/billet-payment/billet-barcode.js";
    this.elementRef.nativeElement.appendChild(s);
    if (callback) {
      callback();
    }
  }

  public getCurrentDate(): string {
    return moment().format('DD/MM/YYYY');
  }

  public getMaturityDate(date): string {
    return moment(date).add(1, 'd').format('DD/MM/YYYY');
  }

  private print(): void {
    $('#btnPrintBillet_' + this.billetShipping.id).prop('disabled', false);
    let s2 = document.createElement("script");
    s2.type = "text/javascript";
    s2.src = "src/app/financial/bills-to-pay/print-billet.js";
    this.elementRef.nativeElement.appendChild(s2);
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
    let verifyDigit = ((totalFourthGroup * 10) / 11).toString().split(".")[1];
    let numberVerifyDigit = 0;
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
    //Código do beneficiário: 45000
    //DV do Código do Beneficiário = 0
  }

}

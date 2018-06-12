import { CadG2 } from './../../cad-g2/cad-g2';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BillToPayService} from './bill-to-pay.service';
import * as moment from 'moment';
import {Payment} from './payment';
import {TypeInterestChargeService} from '../type-interest-charge.service';
import {TypeInterestCharge} from '../type-interest-charge';
import {BillToPayPayment} from './bill-to-pay-payment';
import {BilletShipping} from './billet-payment/billet-shipping';
import * as $ from 'jquery';
import {ClientService} from '../../search-client/client.service';
import {Client} from '../../search-client/client';
import {ModalDirective} from 'ngx-bootstrap';
import {BankService} from './bank.service';
import {Bank} from './bank';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { CadG2Service } from '../../cad-g2/cad-g2.service';
import * as JSZip from "jszip";

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

  public client: Client = new Client();

  public bank: Bank;

  public codeBarFirstGroup: string;
  public codeBarSecondGroup: string;
  public codeBarThirdGroup: string;
  public generalVerifyDigit: any;
  public codeBarFourGroup: string;

  @ViewChild('modalLateBill')
  public modalLateBill: ModalDirective;

  @ViewChild('modalChoosePrintType')
  public modalChoosePrintType: ModalDirective;

  @ViewChild('modalInfoBilletLate')
  public modalInfoBilletLate: ModalDirective;

  public beneficiaryCodeSantander: string = '8548862';

  public ourNumberSantander: string;

  public cadG2: CadG2;

  constructor(private route: ActivatedRoute, private service: BillToPayService, private elementRef: ElementRef,
              private bankService: BankService, private typeInterestService: TypeInterestChargeService,
              private clientService: ClientService, private slimLoadingBarService: SlimLoadingBarService,
              private cadG2Service: CadG2Service) {
    this.payment = new Payment();
    this.paymentMethod = 'BILLET';
    this.clientService.view(this.route.snapshot.params["clientId"]).subscribe(client => {
      this.client = client;
    });
    this.injectDrawBarCodeScript();
    this.slimLoadingBarService.start();

    this.cadG2Service.getById(1).subscribe(result => {
      this.cadG2 = result;
    }, error => {
      console.log(error);
    });

    this.service.listByClientId(this.route.snapshot.params["clientId"], 'NAO').subscribe(result => {
      this.listBillToPayPayment = result;
      if (this.listBillToPayPayment !== undefined && this.listBillToPayPayment.length > 0) {
        this.listBillToPayPayment.forEach(billToPayPayment => {
          if (billToPayPayment.billetShipping) {
            billToPayPayment.billetShipping.codeBar =
            this.generateSantanderCodeBar(billToPayPayment.billetShipping);
          }
          if (billToPayPayment.bank === undefined || billToPayPayment.bank === null
            && billToPayPayment.bankId) {
              this.bankService.getBankById(billToPayPayment.bankId).subscribe(resultBank => {
                billToPayPayment.bank = resultBank;
              });
          }
          this.isDateLessOrEqualThanToday(billToPayPayment);
          this.calculateInterests(billToPayPayment);
          setTimeout(() => {
            let tdCodeBar = document.getElementById("tdBilletCarneCodeBar80mmValue_" + billToPayPayment.id);
            if (tdCodeBar !== null) {
              tdCodeBar.textContent = billToPayPayment.billetShipping.codeBar;
            }
          }, 1500);
        });
      }
      this.stopSlimLoadBar();
    }, error => {
      this.stopSlimLoadBar();
    });
  }

  private injectDrawBarCodeScript(): void {
    let scriptDrawBarCode = document.createElement("script");
    scriptDrawBarCode.type = "text/javascript";
    scriptDrawBarCode.src = "src/app/financial/bills-to-pay/draw-barcode-carne.js";
    this.elementRef.nativeElement.appendChild(scriptDrawBarCode);
  }

  private stopSlimLoadBar(): void {
    this.slimLoadingBarService.stop();
    this.slimLoadingBarService.complete();
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
    return moment(date).format('DD/MM/YYYY');
  }

  public isDateLessOrEqualThanToday(billToPayPayment: any): void {
    billToPayPayment.isChecked = false;
    if (billToPayPayment.maturity === (moment().subtract(1, 'd').format('YYYY-MM-DD'))) {
      // billToPayPayment.isChecked = true;
      // this.listSelectedBillToPayPayment.push(Object.assign({}, billToPayPayment));
      billToPayPayment.dateStatus = 'IS_SAME';
    }
    if (moment(billToPayPayment.maturity).add(1, 'd').isBefore(moment().format('YYYY-MM-DD'))) {
      // billToPayPayment.isChecked = true;
      // this.listSelectedBillToPayPayment.push(Object.assign({}, billToPayPayment));
      billToPayPayment.dateStatus = 'IS_BEFORE';
    }
  }

  private calculateInterests(billToPayment: BillToPayPayment): void {
    billToPayment.amountInterest = (billToPayment.amount / 100) * 1;
    let year = moment(billToPayment.maturity).year();
    let month = moment(billToPayment.maturity).month();
    let day = moment(billToPayment.maturity).date();
    let now = moment();
    let monthInArrears = parseInt(moment([now.year(), now.month(), now.date()])
      .diff(moment([year, month, day]),
      'months', true).toString(), 10);
    let daysInArrears = parseInt(moment().diff(moment(billToPayment.maturity),
      'days').toString(), 10);
    billToPayment.daysInArrears = daysInArrears;
    let chargesInDayMonths: Array<number> = [];
    if (daysInArrears !== undefined && daysInArrears > 0 && this.typeInterestCharge) {
      billToPayment.amountInterest = (billToPayment.amount / 100) *
        this.typeInterestCharge.percentInterest;
      billToPayment.amountCharges = 0.0;
      for (let i = 0; i < daysInArrears; i++) {
        billToPayment.amountCharges += (billToPayment.amount / 100) *
          this.typeInterestCharge.percentCharges;
        if (monthInArrears !== undefined && monthInArrears > 0 && i > 28
            && moment(billToPayment.maturity).add(i + 1, 'd').date() === day) {
          chargesInDayMonths.push(billToPayment.amountCharges);
        }
      }
      billToPayment.amountLiveDays = 0.0;
      if (chargesInDayMonths.length > 0) {
        billToPayment.amountLiveDays =  ((billToPayment.amount / 100) *
        (this.typeInterestCharge.percentLiveDays * billToPayment.daysInArrears));
      }
      billToPayment.subTotal = billToPayment.amount + billToPayment.amountInterest +
      billToPayment.amountLiveDays + billToPayment.amountCharges;
    } else {
      billToPayment.subTotal = billToPayment.amount;
    }
  }

  public generateBillet(billetShipping: BilletShipping, bankId: number): void {
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
    this.bankService.getBankById(bankId).subscribe(bank => {
      this.bank = bank;
      this.generateCodeBarCaixa(this.billetShipping, this.generateQrCode(this.print()));
    });
  }

  private generateCodeBarCaixa(billetShipping: BilletShipping, callback): void {
    // Posição 1-3 -> Identificação do banco (104)
    // Posição 4 -> Código da moeda (9 - Real)
    let codeBarToReturn: string = "";
    // Posição 06 - 09 -> Fator de Vencimento
    let maturityFactor = this.getMaturityFactor(billetShipping.maturityDate);
    let billetValueCalculated = this.getBilletCodeBarValue(billetShipping.billValue).toString();
    // 20 – 25 6 9 (6) Código do Beneficiário
    let benefictCode = "377192";
    // 26 – 26 1 9 (1) DV do Código do Beneficiário
    let dvBenefictCode = this.getVerifyDigitBeneficiaryCode(benefictCode);
    // 27 – 29 3 9 (3) Nosso Número - Seqüência 1
    codeBarToReturn += billetShipping.ourNumber.substring(0, 2);
    // 30 – 30 1 9 (1) Constante 1
    codeBarToReturn += "1";
    // 31 – 33 3 9 (3) Nosso Número - Seqüência 2
    codeBarToReturn += billetShipping.ourNumber.substring(3, 5);
    // 34 – 34 1 9 (1) Constante 2
    codeBarToReturn += "4";
    // 35 – 43 9 9 (9) Nosso Número - Seqüência 3
    codeBarToReturn += billetShipping.ourNumber.substring(6, billetShipping.ourNumber.length - 1);
    // 44 – 44 1 9 (1) DV do Campo Livre
    // Código do beneficiário -> 377192
    let dvFreeCamp = this.getFreeCampCodeBar("377192", dvBenefictCode.toString(), billetShipping.ourNumber);
    this.generalVerifyDigit = this.getVerifyDigitGeneral(maturityFactor, billetValueCalculated, benefictCode,
      dvBenefictCode.toString(), billetShipping.ourNumber, dvFreeCamp);

    let field1 = "1049" + benefictCode.charAt(0) + "." + benefictCode.substring(1, 5) +
      this.getVerifyDigitFields123("1049" + benefictCode.charAt(0) + benefictCode.substring(1, 5));
    let field2 = benefictCode.charAt(benefictCode.length - 1) + dvBenefictCode + billetShipping.ourNumber.substring(0, 3)
      + ".1" + billetShipping.ourNumber.substring(3, 6) + "4" +
      this.getVerifyDigitFields123(benefictCode.charAt(benefictCode.length - 1) + dvBenefictCode +
        billetShipping.ourNumber.substring(0, 3) + "1" + billetShipping.ourNumber.substring(3, 6) + "4");
    let field3 = billetShipping.ourNumber.substring(6, 11) + "." +
      billetShipping.ourNumber.substring(11, billetShipping.ourNumber.length) + dvFreeCamp +
      this.getVerifyDigitFields123(billetShipping.ourNumber.substring(6, 11) +
        billetShipping.ourNumber.substring(11, billetShipping.ourNumber.length) + dvFreeCamp);

    this.codeBarFirstGroup = field1.replace(".", "").replace(" ", "");
    this.codeBarSecondGroup = field2.replace(".", "").replace(" ", "");
    this.codeBarThirdGroup = field3.replace(".", "").replace(" ", "");
    this.codeBarFourGroup = maturityFactor
      + billetValueCalculated.replace(".", "").replace(" ", "");

    codeBarToReturn = field1 + " " + field2 + " " + field3 + " " + this.generalVerifyDigit + " " +
    maturityFactor + billetValueCalculated;

    billetShipping.ourNumber = "14" + billetShipping.ourNumber + "-" +
      this.getVerifyDigitOurNumber("14" + billetShipping.ourNumber);

    billetShipping.codeBar = codeBarToReturn;

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
      if ( i % 2 === 0 || i === 0) {
        if ((parseInt(strToCalc[i], 10) * 2).toString().split("").length === 2) {
          let alg1 = parseInt((parseInt(strToCalc[i], 10) * 2).toString().split("")[0], 10);
          let alg2 = parseInt((parseInt(strToCalc[i], 10) * 2).toString().split("")[1], 10);
          total += (alg1 + alg2);
        } else {
          total += parseInt(strToCalc[i], 10) * 2;
        }
      } else {
        total += parseInt(strToCalc[i], 10);
      }
    }
    if (total < 10) {
      toReturn = 10 - total;
    }
    let rest = total % 10;

    if (rest === 0) {
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
    let calcStrArray = ("1049" + maturityFactor + billetValue + benefictCode + dvBenefictCode + ourNumber.substring(0, 3)
      + "1" + ourNumber.substring(3, 6) + "4" + ourNumber.substring(6 , ourNumber.length) + dvFreeCamp).split("");
    let total: number = 0;
    for (let i = 0; i < calcStrArray.length; i++) {
      if (i === 0 || i === 8 || i === 16 || i === 24 || i === 32 || i === 40) {
        total += parseInt(calcStrArray[i], 10) * 4;
      }
      if (i === 1 || i === 9 || i === 17 || i === 25 || i === 33 || i === 41) {
        total += parseInt(calcStrArray[i], 10) * 3;
      }
      if (i === 2 || i === 10 || i === 18 || i === 26 || i === 34 || i === 42) {
        total += parseInt(calcStrArray[i], 10) * 2;
      }
      if (i === 3 || i === 11 || i === 19 || i === 27 || i === 35 || i === 43) {
        total += parseInt(calcStrArray[i], 10) * 9;
      }
      if (i === 4 || i === 12 || i === 20 || i === 28 || i === 36) {
        total += parseInt(calcStrArray[i], 10) * 8;
      }
      if (i === 5 || i === 13 || i === 21 || i === 29 || i === 37) {
        total += parseInt(calcStrArray[i], 10) * 7;
      }
      if (i === 6 || i === 14 || i === 22 || i === 30 || i === 38) {
        total += parseInt(calcStrArray[i], 10) * 6;
      }
      if (i === 7 || i === 15 || i === 23 || i === 31 || i === 39) {
        total += parseInt(calcStrArray[i], 10) * 5;
      }
    }
    let rest = total % 11;
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
      total += (parseInt(beneficiaryCodeInverted[i], 10) * (i + 2));
    }
    let rest: number = 0;
    if (total >= 11) {
      rest = total % 11;
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
    let strCalcFreeCamp = beneficCode + dvBenefictCode + ourNumber.substring(0, 3) + "1" +
    ourNumber.substring(3, 6) + "4" +
      ourNumber.substring(6 , ourNumber.length);
    let strInverted = strCalcFreeCamp.split("").reverse().join("");
    let multiplicationIndex: number = 2;
    let total: number = 0;
    for (let i = 0; i < strInverted.length; i++) {
      if (i === 8 || i === 16) {
        multiplicationIndex = 2;
      }
      total += (parseInt(strInverted[i], 10)) * multiplicationIndex;
      multiplicationIndex++;
    }
    if (total < 11) {
      result = total - 11;
    } else {
      let rest: number = total % 11;
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
    if (billValue.toString().indexOf(".") === -1 && billValue.toString().indexOf(",") === -1) {
      for (let i = 0; i < (8 - billValue.toString().length); i++) {
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
      if (i === 8 || i === 16) {
        multiplicationIndex = 2;
      }
      total += (parseInt(ourNumberInverted[i], 10) * multiplicationIndex);
      multiplicationIndex++;
    }
    let rest: number = total % 11;
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
    s.src = "src/app/financial/bills-to-pay/generate_barcode_print_80mm.js";
    this.elementRef.nativeElement.appendChild(s);
    if (callback) {
        callback();
    }
  }

  private generateBarCodeAndPrint80mm(): void {
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "src/app/financial/bills-to-pay/generate_barcode_print_80mm.js";
    this.elementRef.nativeElement.appendChild(s);
  }

  private generateBarCodeAndPrint(): void {
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "src/app/financial/bills-to-pay/generate_barcode_print.js";
    this.elementRef.nativeElement.appendChild(s);
  }

  public getCurrentDate(): string {
    return moment().format('DD/MM/YYYY');
  }

  public getMaturityDate(date): string {
    // return moment(date).add(1, 'd').format('DD/MM/YYYY');
    return moment(date).format('DD/MM/YYYY');
  }

  public getMaturityInterestDate(date): string {
    return moment(date).add(1, 'd').format('DD/MM/YYYY');
  }

  private print(): void {
    $('#btnPrintBillet_' + this.billetShipping.id).prop('disabled', false);
    let s2 = document.createElement("script");
    s2.type = "text/javascript";
    s2.src = "src/app/financial/bills-to-pay/print-billet.js";
    this.elementRef.nativeElement.appendChild(s2);
  }

  private print80mm(): void {
    $('#btnPrintBillet_' + this.billetShipping.id).prop('disabled', false);
    let scriptPrintBillet80mm = document.createElement("script");
    scriptPrintBillet80mm.type = "text/javascript";
    scriptPrintBillet80mm.src = "src/app/financial/bills-to-pay/print-billet-80mm.js";
    this.elementRef.nativeElement.appendChild(scriptPrintBillet80mm);
  }

  private generateCodeBar(): void {
    // Primeiro Grupo
    let codeBarFirstGroup = "033998548";
    let codeBarFirstGroupInverted = codeBarFirstGroup.split("").reverse().join("");
    let total = 0;
    for (let i = 0; i < codeBarFirstGroupInverted.length; i++) {
      let currentNumber = parseInt(codeBarFirstGroupInverted[i], 10);
      if (i === 4 && currentNumber === 9) {
        total += currentNumber;
      } else {
        if (i % 2 === 0) {
          if (currentNumber * 2 > 10) {
            let firstDigit: number = parseInt((currentNumber * 2).toString().split("")[0].toString(), 10);
            let secondDigit: number = parseInt((currentNumber * 2).toString().split("")[1].toString(), 10);
            total += (firstDigit + secondDigit);
          } else {
            total += currentNumber * 2;
          }
        } else {
          total += currentNumber;
        }
      }
    }
    let digitRest = parseInt((total / 10).toString().split(".")[1], 10);
    codeBarFirstGroup += "." + (10 - digitRest);
    // Segundo Grupo
    let codeBarSecondGroup = "862" + this.ourNumber.substr(0, 7);
    let codeBarSecondGroupInverted = codeBarSecondGroup.split("").reverse().join("");
    let totalSecondGroup = 0;
    for (let j = 0 ; j < codeBarSecondGroupInverted.length; j++) {
      let currentNumber = parseInt(codeBarSecondGroupInverted[j], 10);
      if (j % 2 === 0) {
        totalSecondGroup += currentNumber * 2;
      } else {
        totalSecondGroup += currentNumber;
      }
    }
    let digitRestSecondGroup = parseInt((totalSecondGroup / 10).toString().split(".")[1], 10);
    codeBarSecondGroup += '.' + (10 - digitRestSecondGroup);
    // Terceiro Grupo
    let codeBarThirdGroup = this.ourNumber.substr(7, 14);
    codeBarThirdGroup = codeBarThirdGroup.replace(/-/g, "");
    codeBarThirdGroup += "0101";
    let codeBarThirdGroupInverted = codeBarThirdGroup.split("").reverse().join("");
    let totalThirdGroup = 0;
    for (let k = 0; k < codeBarThirdGroupInverted.length; k++) {
      let currentNumberThirdGroup = parseInt(codeBarThirdGroupInverted[k], 10);
      if (k % 2 === 0) {
        totalThirdGroup += currentNumberThirdGroup * 2;
      } else {
        totalThirdGroup += currentNumberThirdGroup;
      }
    }
    let restDigitThirdGroup = (totalThirdGroup / 10).toString().split(".")[1] !== undefined ?
      parseInt((totalThirdGroup / 10).toString().split(".")[1], 10) : 0;
    restDigitThirdGroup = restDigitThirdGroup !== NaN ? restDigitThirdGroup : 0;
    codeBarThirdGroup +=  "." + (10 - restDigitThirdGroup);
    // Quarto Grupo - Digito Verificador
    let factorMaturity = moment().diff(moment("1997-10-07"), 'days');
    // Numero PSK (Codigo G2) = 8548862
    // calcular valor nominal (10 digitos)
    let valueStr = (this.totalPayment.toFixed(2)).replace(/([.*+?^$|(){}\[\]-])/mg, "");
    let nominalValue = '';
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
      totalFourthGroup += parseInt(verifyDigitStrInverted[p], 10) * numberToCalc;
      numberToCalc++;
      if (p === 7 || p === 15 || p === 23 || p === 31 || p === 39) {
        numberToCalc = 2;
      }
    }
    let verifyDigit = ((totalFourthGroup * 10) / 11).toString().split(".")[1];
    let numberVerifyDigit = 0;
    if (verifyDigit !== undefined) {
      if (verifyDigit.split("").length > 1) {
        if (parseInt(verifyDigit.split("")[1], 10) > 5) {
          numberVerifyDigit = parseInt(verifyDigit.split("")[0], 10) + 1;
        } else {
          numberVerifyDigit = parseInt(verifyDigit.split("")[0], 10);
        }
      } else {
        numberVerifyDigit = parseInt(verifyDigit.split("")[0], 10);
      }
    }
    // Quinto Grupo -> Fator de Vencimento e Valor Nominal
    let codeBarFifthGroup = factorMaturity + nominalValue;
    this.codeBar = codeBarFirstGroup + " " + codeBarSecondGroup + " " + codeBarThirdGroup + " " +
    numberVerifyDigit + " " + codeBarFifthGroup;
    // Código do beneficiário: 45000
    // DV do Código do Beneficiário = 0
  }

  public showModalBillet(billetShipping: BilletShipping, bankId: number): void {
    this.billetShipping = Object.assign({}, billetShipping);
    if (!this.typeInterestCharge || !this.typeInterestCharge.liveDaysValue) {
      if (this.billetShipping.type) {
        this.typeInterestService.getByType(this.billetShipping.type).subscribe(result => {
          this.typeInterestCharge = result;
        }, error => {
          console.log(error);
        });
      }
    }
    this.bankService.getBankById(bankId).subscribe(bank => {
      this.bank = bank;
      if (bank.id === 10)
        this.generateCodeBarCaixa(this.billetShipping, undefined);
      else if (bank.id === 9)
        this.generateSantanderCodeBar(this.billetShipping);
      this.modalLateBill.show();
    });
  }

  public showModalChoosePrintType(billToPayPayment: BillToPayPayment): void {
    this.billetShipping = Object.assign({}, billToPayPayment.billetShipping);
    if (!this.typeInterestCharge || !this.typeInterestCharge.liveDaysValue) {
      this.typeInterestService.getByType(billToPayPayment.description).subscribe(result => {
        this.typeInterestCharge = result;
      }, error => {

      });
    }
    this.bankService.getBankById(billToPayPayment.bankId).subscribe(bank => {
      this.bank = bank;
      if (bank.id === 10)
        this.generateCodeBarCaixa(this.billetShipping, undefined);
      else if (bank.id === 9)
        this.generateSantanderCodeBar(this.billetShipping);
      this.modalChoosePrintType.show();
    });
  }

  onNotify(msg: any): void {
    if (msg.message === 'printBillet') {
      document.getElementById('ifrOutput').style.display = 'block';
      this.generateBarCodeAndPrint();
    }
    if (msg.message === 'printBillet80mm') {
      document.getElementById('ifrOutput80mm').style.display = 'block';
      this.generateBarCodeAndPrint80mm();
      // this.print80mm();
    }
  }

  public isBilletOld(maturityDate: Date): Boolean {
    return moment(maturityDate) < moment([2017, 8, 30]);
  }

  private getFirstGroupSantander(): number {
    let barCodeFirstGroup: string = ('03399' + this.beneficiaryCodeSantander.substr(0, 4))
      .replace(".", "").split('').reverse().join('');
    let totalSum: number = 0;
    for (let i = 0; i < barCodeFirstGroup.length; i++) {
      if (i % 2 === 0 || i === 0) {
        let currentResult: number = (parseInt(barCodeFirstGroup[i], 10) * 2);
        if (currentResult > 9) {
          totalSum += parseInt(currentResult.toString().split('')[0], 10) +
            parseInt(currentResult.toString().split('')[1], 10);
        } else {
          totalSum += currentResult;
        }
      } else {
        totalSum += (parseInt(barCodeFirstGroup[i], 10) * 1);
      }
    }
    let rest = totalSum % 10;
    let toReturn: number;
    if (rest === 0) {
      toReturn = 0;
    } else {
      toReturn = 10 - rest;
    }
    return toReturn;
  }

  private getSecondGroupSantander(billetShipping: BilletShipping): number {
    let secondGroupReversed = (this.beneficiaryCodeSantander.substr(4, 7) +
    billetShipping.ourNumber.substr(0, 7)).split('').reverse().join('');

    let totalSum: number = 0;

    for (let i = 0; i < secondGroupReversed.length; i++) {
      if (i % 2 === 0 || i === 0) {
        let currentResult: number = (parseInt(secondGroupReversed[i], 10) * 2);
        if (currentResult > 9) {
          totalSum += parseInt(currentResult.toString().split('')[0], 10) +
            parseInt(currentResult.toString().split('')[1], 10);
        } else {
          totalSum += currentResult;
        }
      } else {
        totalSum += parseInt(secondGroupReversed[i], 10) * 1;
      }
    }
    let rest = totalSum % 10;
    let toReturn: number;
    if (rest === 0) {
      toReturn = 0;
    } else {
      toReturn = 10 - rest;
    }
    return toReturn;
  }

  private getVerifyDigitOurNumberSantander(ourNumberSantander: string): number {
    let ourNumberInverted = ourNumberSantander.substr(0, 12).split('').reverse().join('');
    let numToMult: number = 2;
    let total: number = 0;
    for (let i = 0; i < ourNumberInverted.length; i++) {
      if (numToMult > 9)
        numToMult = 2;
      total += parseInt(ourNumberInverted[i], 10) * numToMult;
      numToMult++;
    }
    let rest = total % 11;
    if (rest === 10)
      return 1;
    if (rest === 0 || rest === 1)
      return 0;
    return 11 - rest;
  }

  public getThridGroupSantander(ourNumberSantander: string): number {
    let thirdGroupInverted = (ourNumberSantander.substring(7, ourNumberSantander.length) +
    + "0" + "101").split('').reverse().join('');
    let total: number = 0;
    for (let i = 0; i < thirdGroupInverted.length; i++) {
      if (i % 2 === 0 || i === 0) {
        let currentResult = parseInt(thirdGroupInverted[i], 10) * 2;
        if (currentResult > 9) {
          total += parseInt(currentResult.toString().split('')[0], 10) +
            parseInt(currentResult.toString().split('')[1], 10);
        } else {
          total += currentResult;
        }
      } else {
        total += parseInt(thirdGroupInverted[i], 10) * 1;
      }
    }
    let rest: number = total % 10;
    if (rest === 0) {
      return 0;
    } else {
      return 10 - rest;
    }
  }

  private getVerifyDigitSantander(barCode: string): number {
    let strBarCodeInverted = barCode.split('').reverse().join('');
    let numToMult: number = 2;
    let total: number = 0;
    for (let i = 0; i < strBarCodeInverted.length; i++) {
      if (numToMult > 9)
        numToMult = 2;
      total += parseInt(strBarCodeInverted[i], 10) * numToMult;
      numToMult++;
    }
    let rest = ((total * 10) % 11);
    if (rest === 0 || rest === 10)
      return 1;
    return rest;
  }

  public onChangeCheckBillet(billToPayPayment: BillToPayPayment, event: any): void {
    if (event.target.checked && billToPayPayment.billetShipping !== null) {
      $(".checkBillet").prop("disabled", "disabled");
      if (this.listSelectedBillToPayPayment.indexOf(billToPayPayment) === -1)
            this.listSelectedBillToPayPayment.push(billToPayPayment);
      if (billToPayPayment.bank === undefined || billToPayPayment === null) {
        this.bankService.getBankById(billToPayPayment.bankId).subscribe(bank => {
          billToPayPayment.bank = bank;
        });
      }
      if (billToPayPayment.billetShipping) {
        if (billToPayPayment.bank.id === 9)
          this.generateSantanderCodeBar(billToPayPayment.billetShipping);
        else
          this.generateCodeBarCaixa(billToPayPayment.billetShipping, undefined);
        setTimeout(() => {
          document.getElementById("tdBilletCarneCodeBar80mmValue_" + billToPayPayment.id).textContent =
          billToPayPayment.billetShipping.codeBar;
          $(".checkBillet").prop("disabled", false);
        }, 500);
      }
    } else {
      for (let i = 0; i < this.listSelectedBillToPayPayment.length; i++) {
        if (this.listSelectedBillToPayPayment[i].id === billToPayPayment.id) {
          this.listSelectedBillToPayPayment.splice(i, 1);
        }
      }
    }
  }

  public printCarne80mm(): void {
    document.getElementById("btnPrintCarne80mm").setAttribute("disabled", "disabled");
    $('#btnPrintCarne80mm').prop("disabled", "disabled");
    let scriptPrintBillet80mm = document.createElement("script");
    scriptPrintBillet80mm.type = "text/javascript";
    scriptPrintBillet80mm.src = "src/app/financial/bills-to-pay/generate_carne_print_80mm.js";
    this.elementRef.nativeElement.appendChild(scriptPrintBillet80mm);
    document.getElementById("btnPrintCarne80mm").removeAttribute("disabled");
  }

  private generateSantanderCodeBar(billetShipping: BilletShipping): void {

    let ourNumberSantander = billetShipping.ourNumber;

    let firstGroup = '03399.' + this.beneficiaryCodeSantander.substr(0, 4)
      + this.getFirstGroupSantander();

     let secondGroup = this.beneficiaryCodeSantander.substr(4, 7)
      + ourNumberSantander.substr(0, 7) + this.getSecondGroupSantander(billetShipping);

    secondGroup = secondGroup.substr(0, 5) + "." + secondGroup.substr(5, secondGroup.length);

    let thirdGroup = ourNumberSantander.substring(7, ourNumberSantander.length)
      + '0101' + this.getThridGroupSantander(ourNumberSantander);

    thirdGroup = thirdGroup.substr(0, 5) + "." + thirdGroup.substr(5, thirdGroup.length);

    let dvVerify = this.getVerifyDigitSantander('0339' + this.getMaturityFactor(billetShipping.maturityDate) +
      this.getBilletCodeBarValue(billetShipping.billValue) + '9' + this.beneficiaryCodeSantander +
      ourNumberSantander + '0' + '101');

    let strBillValue: string = '';
    let billValue = this.getBilletCodeBarValue(billetShipping.billValue);
    for (let i = 0; i < (10 - billValue.length); i++) {
      strBillValue += '0';
    }
    strBillValue += billValue;

    let fifthGroup = this.getMaturityFactor(billetShipping.maturityDate)
      + strBillValue;

    this.codeBar = firstGroup + ' ' + secondGroup + ' ' + thirdGroup + ' ' + dvVerify + ' ' + fifthGroup;

    billetShipping.codeBar = firstGroup + ' ' + secondGroup + '. ' + thirdGroup + ' ' + dvVerify + ' ' + fifthGroup;
  }

  private getCadG2Formatted(): string {
    if (this.cadG2 !== null && this.cadG2 !== undefined) {
      let strToReturn = this.cadG2.razaoSocial !== null ? this.cadG2.razaoSocial : this.cadG2.fantasyName;
      strToReturn += ", " + this.cadG2.address + ", " + this.cadG2.num + ", " +
      this.cadG2.city + ", " + this.cadG2.neighborhood + ". CNPJ: " + this.cadG2.cnpj;

      return strToReturn;
    }
  }

  public goToAttBillet(): void {
    window.open('https://www.santander.com.br/br/resolva-on-line/reemissao-de-boleto-vencido', '_blank');
  }

}

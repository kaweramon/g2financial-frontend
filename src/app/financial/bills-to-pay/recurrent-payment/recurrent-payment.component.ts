import {Component, Input, ViewChild} from '@angular/core';
import {Payment} from '../payment';
import {BillToPayService} from '../bill-to-pay.service';
import {ActivatedRoute} from '@angular/router';
import {ClientService} from '../../../search-client/client.service';
import {Client} from '../../../search-client/client';
import * as moment from 'moment';
import {BillToPayAmountsPaid} from '../bill-to-pay-amounts-paid';
import {BillToPayAmountsPaidService} from '../bill-to-pay-amounts-paid.service';
import {BillToPayPaymentService} from '../bill-to-pay-payment.service';
import {CieloPaymentService} from '../cielo-payment.service';
import {CieloPayment} from '../cielo-payment';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import * as $ from 'jquery';
import {ToastyConfig, ToastyService} from 'ng2-toasty';
import {Constants} from '../../../util/constants';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'app-recurrent-payment',
  templateUrl: './recurrent-payment.component.html',
  styleUrls: ['./recurrent-payment.component.css']
})
export class RecurrentPaymentComponent {

  @Input()
  public totalPayment: number;

  @Input()
  public listBillToPayPayment: Array<any>;

  public payment: Payment;

  public client: Client;

  public maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public maskSecurityCode = [/[0-9]/, /\d/, /\d/];

  public cieloPayment: CieloPayment;

  @ViewChild('modalReceipt')
  public modalReceipt: ModalDirective;

  public checkFuturePayments: boolean;

  constructor(private billToPayService: BillToPayService, private route: ActivatedRoute, private clientService: ClientService,
              private billToPayAmountPaidService: BillToPayAmountsPaidService, private toastyService: ToastyService,
              private toastyConfig: ToastyConfig, private slimLoadingBarService: SlimLoadingBarService,
              private billToPayPaymentService: BillToPayPaymentService, private cieloPaymentService: CieloPaymentService) {
    this.payment = new Payment();
    this.payment.Installments = 1;
    this.payment.RecurrentPayment.Interval = "Annual";
    this.getClient();
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = 'top-right';
    this.checkFuturePayments = true;
  }

  private getClient(): void {
    this.clientService.view(this.route.snapshot.params['clientId']).subscribe(client => {
      this.client = client;
    })
  }

  public doPayment(): void {
    $('#btnDoPayment').prop("disabled",true);
    this.payment.Type = "CreditCard";
    this.payment.Amount = this.totalPayment;
    this.payment.SoftDescriptor =  "TESTE";
    this.slimLoadingBarService.start();
    let copyPayment = Object.assign({}, this.payment);
    copyPayment.DebitCard = undefined;
    copyPayment.RecurrentPayment = undefined;
    let creditCardPayment = {
      MerchantOrderId: "2014113245231706",
      Customer: {
        Name: this.client.name
      },
      Payment: copyPayment
    };
    this.billToPayService.paymentCreditCard(creditCardPayment).subscribe(cieloPaymentReturn => {
      if (cieloPaymentReturn.Payment.ReturnCode === "4") {
        this.saveListBillToPayPayment();
        this.saveListBillToPayAmountsPaid();
        if (this.checkFuturePayments) {
          this.saveCardToken(cieloPaymentReturn);
        } else {
          this.saveCieloPayment(cieloPaymentReturn, undefined);
        }
      } else {
        this.stopSlimLoadingBar();
        this.showMsgError(parseInt(cieloPaymentReturn.Payment.ReturnCode), cieloPaymentReturn.Payment.ReturnMessage);
      }
      $('#btnDoPayment').prop("disabled",false);
    }, error => {
      this.stopSlimLoadingBar();
      if (error.json().length > 0) {
        error.json().forEach(error => {
          this.showMsgError(error.Code, error.Message);
        });
      } else if (error.json() !== undefined) {
        this.showMsgError(error.json().Code, error.json().Message);
      }
      $('#btnDoPayment').prop("disabled",false);
    });
  }

  private saveCardToken(cieloPaymentReturn:any): void {
    let cardTokenRequest: any = {
      CustomerName: this.client.name,
      CardNumber: this.payment.CreditCard.CardNumber,
      Holder: this.payment.CreditCard.Holder,
      ExpirationDate: this.payment.CreditCard.ExpirationDate,
      Brand: this.payment.CreditCard.Brand
    };
    this.billToPayService.createCardToken(cardTokenRequest).subscribe(result => {
      this.saveCieloPayment(cieloPaymentReturn, result.CardToken);
    }, error => {
      this.stopSlimLoadingBar();
      if (error.json().length > 0) {
        error.json().forEach(error => {
          this.showMsgError(error.Code, error.Message);
        });
      } else if (error.json() !== undefined) {
        this.showMsgError(error.json().Code, error.json().Message);
      }
    });
  }

  private stopSlimLoadingBar(): void {
    this.slimLoadingBarService.stop();
    this.slimLoadingBarService.complete();
  }

  private showMsgError(code: number, message: string): void{
    switch (code) {
      case 57:
        this.toastyService.error({title: Constants.MSG_ERROR_57_CARD_EXPIRED, showClose: true,timeout: 7000});
        break;
      case 108:
        this.toastyService.error({title: Constants.MSG_ERROR_108_AMOUNT_GREATER_THAN_ZERO, showClose: true,timeout: 7000});
        break;
      case 117:
        this.toastyService.error({title: Constants.MSG_ERROR_117_HOLDER_IS_REQUIRED, showClose: true,timeout: 7000});
        break;
      case 118:
        this.toastyService.error({title: Constants.MSG_ERROR_118_CREDIT_CARD_NUMBER_REQUIRED, showClose: true,timeout: 7000});
        break;
      case 125:
        this.toastyService.error({title: Constants.MSG_ERROR_125_CREDIT_CARD_EXPIRATION_DATE_REQUIRED, showClose: true,timeout: 7000});
        break;
      case 126:
        this.toastyService.error({title: Constants.MSG_ERROR_126_CREDIT_CARD_EXPIRATION_DATE_IS_INVALID, showClose: true,timeout: 7000});
        break;
      case 127:
        this.toastyService.error({title: Constants.MSG_ERROR_127_CREDIT_CARD_NUMBER_IS_REQUIRED, showClose: true,timeout: 7000});
        break;
      case 128:
        this.toastyService.error({title: Constants.MSG_ERROR_128_CREDIT_CARD_NUMBER_LENGHT_EXCEEDED, showClose: true,timeout: 7000});
        break;
      default:
        this.toastyService.error({title: message, showClose: true,timeout: 7000});
    }
  }

  private saveListBillToPayPayment(): void {
    this.billToPayPaymentService.updateList(this.listBillToPayPayment).subscribe(() => {
    }, error => {
      this.showMsgError(error.join().status, error.json().message);
    })
  }

  private saveCieloPayment(cieloPaymentReturn: any, cardToken: string): void {
    this.cieloPayment = Constants.getCiloPaymentConverted(cieloPaymentReturn, cardToken, false);
    this.cieloPayment.clientId = this.route.snapshot.params['clientId'];
    this.cieloPaymentService.create(this.cieloPayment, false).subscribe(result => {
      this.stopSlimLoadingBar();
      this.modalReceipt.show();
    }, error => {
    })
  }

  public saveListBillToPayAmountsPaid(): void {
    let listBillToPayAmountsPaid: Array<BillToPayAmountsPaid> = [];
    this.listBillToPayPayment.forEach(billToPayPayment => {
      let billToPayAmountsPaid: BillToPayAmountsPaid = new BillToPayAmountsPaid();
      billToPayAmountsPaid.billToPayPaymentId = billToPayPayment.id;
      billToPayAmountsPaid.hour = new Date();
      billToPayAmountsPaid.date = new Date();
      billToPayAmountsPaid.amount = billToPayPayment.subTotal;
      listBillToPayAmountsPaid.push(billToPayAmountsPaid);
    });
    this.billToPayAmountPaidService.saveList(listBillToPayAmountsPaid).subscribe(result => {
    }, error => {
    });
  }

  public checkRecurrency(): void {
    if (parseInt(this.payment.Installments.toString()) > 1) {
      this.payment.RecurrentPayment.Interval = 'None';
    }
  }

  public getCurrentDate(format: string): string {
    return moment().format(format);
  }

  public getLast4DigitsFromCard(): string {
    if (this.payment.CreditCard.CardNumber !== undefined) {
      return this.payment.CreditCard.CardNumber.substr(this.payment.CreditCard.CardNumber.length-4,
        this.payment.CreditCard.CardNumber.length-1);
    } else {
      return '';
    }
  }

  public getNumberRecurrentInstalments(): number {
    switch (this.payment.RecurrentPayment.Interval) {
      case 'Annual':
        return 12;
      case 'SemiAnnual':
        return 6;
      case 'Quarterly':
        return 4;
      case 'Bimonthly':
        return 2;
      default:
        return 12;
    }
  }

  public getConvertedDate(date:any): string {
    return moment(date).format('DD/MM/YYYY');
  }

  public print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('div-payment-receipt').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Comprovante</title>
          <style>
            #div-payment-receipt {
              float: none;
              margin: 0 auto;
              background-color: #EBFAFF
            }
            p {
              font-size: 11px;
              margin: 0;
            }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}

import {Component, ViewChild} from '@angular/core';
import {Payment} from '../bills-to-pay/payment';
import {CieloPaymentService} from '../bills-to-pay/cielo-payment.service';
import {BillToPayService} from '../bills-to-pay/bill-to-pay.service';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {Client} from '../../search-client/client';
import {ClientService} from '../../search-client/client.service';
import {ActivatedRoute} from '@angular/router';
import {ToastOptions, ToastyConfig, ToastyService} from 'ng2-toasty';
import * as $ from 'jquery';
import * as moment from 'moment';
import {Constants} from '../../util/constants';
import {CreditCard} from '../bills-to-pay/credit-card-payment/credit-card';
import {CieloPayment} from '../bills-to-pay/cielo-payment';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'app-for-sale',
  templateUrl: './for-sale.component.html',
  styleUrls: ['./for-sale.component.css']
})
export class ForSaleComponent {

  public payment: Payment;

  public paymentMethod: string;

  public client: Client;

  public paymentDescription: string;

  public maskSecurityCode = [/[0-9]/, /\d/, /\d/];

  public maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  @ViewChild('modalReceiptForSale')
  public modalReceiptForSale: ModalDirective;

  public cieloPayment: CieloPayment;

  constructor(private cieloPaymentService: CieloPaymentService, private billToPayService: BillToPayService,
              private route: ActivatedRoute, private toastyService: ToastyService, private toastyConfig: ToastyConfig,
              private slimLoadingBarService: SlimLoadingBarService, private clientService: ClientService) {
    this.payment = new Payment();
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = 'top-right';
    this.clientService.view(this.route.snapshot.params['clientId']).subscribe(client => {
      this.client = client;
    })
  }

  public doPayment() {
    if (this.paymentMethod === 'CREDIT') {
      $('#btnDoPaymentForSaleCreditCard').prop("disabled",true);
      this.payment.Type = "CreditCard";
      if (this.client.name.length > 13) {
        this.payment.SoftDescriptor = this.client.name.substring(0,13);
      } else {
        this.payment.SoftDescriptor = this.client.name;
      }
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
          let toastOptions: ToastOptions = {
            title: "Pagamento Realizado",
            showClose: true,
            timeout: 4000
          };
          this.toastyService.success(toastOptions);
          this.saveCieloPayment(cieloPaymentReturn, undefined);
        } else {
          this.stopSlimLoadingBar();
          this.showMsgError(parseInt(cieloPaymentReturn.Payment.ReturnCode), cieloPaymentReturn.Payment.ReturnMessage);
        }
        $('#btnDoPaymentForSaleCreditCard').prop("disabled",false);
      }, error => {
        this.handleError(error);
      })
    } else if (this.paymentMethod === 'DEBIT') {
      let debitPayment = {
        MerchantOrderId: "2014121201",
        Customer: {
          Name: this.client.name
        },
        Payment: {
          Type: "DebitCard",
          ReturnUrl: "http://localhost:4200",
          Amount: 5,
          DebitCard: this.payment.DebitCard
        }
      };
      this.billToPayService.paymentDebitCard(debitPayment).subscribe(cieloPaymentReturn => {
        let toastOptions: ToastOptions = {
          title: "Pagamento Realizado",
          showClose: true,
          timeout: 4000
        };
        this.toastyService.success(toastOptions);
        this.saveCieloPayment(cieloPaymentReturn, undefined);
      }, error => {
        this.handleError(error);
      })
    }
  }

  private handleError(error) {
    this.stopSlimLoadingBar();
    console.log(error);
    if (error.json().length > 0) {
      error.json().forEach(error => {
        this.showMsgError(error.Code, error.Message);
      });
    } else if (error.json() !== undefined) {
      this.showMsgError(error.json().Code, error.json().Message);
    }
    $('#btnDoPayment').prop("disabled",false);
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

  private saveCieloPayment(cieloPaymentReturn: any, cardToken: string): void {
    this.cieloPayment = Constants.getCiloPaymentConverted(cieloPaymentReturn, cardToken, true);
    this.cieloPayment.description = this.paymentDescription;
    this.cieloPayment.clientId = this.route.snapshot.params['clientId'];
    console.log(this.cieloPayment);
    this.cieloPaymentService.create(this.cieloPayment, true).subscribe(() => {
      this.stopSlimLoadingBar();
      console.log("showModal");
      console.log(this.modalReceiptForSale);
      this.modalReceiptForSale.show();
    }, error => {
    })
  }

  public getCurrentDate(format: string): string {
    return moment().format(format);
  }

  public getConvertedDate(date:any): string {
    return moment(date).format('DD/MM/YYYY');
  }

  public getLast4DigitsFromCard(): string {
    if (this.payment.CreditCard.CardNumber !== undefined) {
      return this.payment.CreditCard.CardNumber.substr(this.payment.CreditCard.CardNumber.length-4,
        this.payment.CreditCard.CardNumber.length-1);
    } else if (this.payment.DebitCard.CardNumber !== undefined) {
      return this.payment.DebitCard.CardNumber.substr(this.payment.DebitCard.CardNumber.length-4,
        this.payment.DebitCard.CardNumber.length-1);
    } else {
      return '';
    }
  }

  public print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('div-payment-receipt-for-sale').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=100%');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Comprovante</title>
          <style>
            #div-payment-receipt-for-sale {
              float: none;
              margin: 0 auto;
              background-color: #EBFAFF;
              max-width: 250px;
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

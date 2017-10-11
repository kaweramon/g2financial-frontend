import {Component, Inject, ViewChild} from '@angular/core';
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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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

  public amountString: any;

  public formForSale: FormGroup;

  public formForSaleDebitCard: FormGroup;

  public formForSaleCreditCard: FormGroup;

  private formBuilder: FormBuilder;

  constructor(private cieloPaymentService: CieloPaymentService, private billToPayService: BillToPayService,
              private route: ActivatedRoute, private toastyService: ToastyService, private toastyConfig: ToastyConfig,
              private slimLoadingBarService: SlimLoadingBarService, private clientService: ClientService,
              @Inject(FormBuilder) formBuilder: FormBuilder) {
    this.payment = new Payment();
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = 'top-right';
    this.formBuilder = formBuilder;
    this.initFormBuilder();
    this.initFormBuilderDebitCard();
    this.initFormBuilderCreditCard();
    this.clientService.view(this.route.snapshot.params['clientId']).subscribe(client => {
      this.client = client;
    })
  }

  private initFormBuilder(): void {
    this.formForSale = this.formBuilder.group({
      'paymentDescription': [this.paymentDescription, [Validators.required, Validators.minLength(3)]],
      'amountString': [this.amountString, [Validators.required]],
      'paymentMethod': [this.paymentMethod]
    });
  }

  private initFormBuilderCreditCard() : void {
    this.formForSaleCreditCard = this.formBuilder.group({
      'creditCardBrand': [this.payment.CreditCard.Brand, [Validators.required]],
      'creditCardNumber': [this.payment.CreditCard.CardNumber, [Validators.required,
        Validators.minLength(16)]],
      'creditCardExpirationDate': [this.payment.CreditCard.ExpirationDate, [Validators.required]],
      'creditCardSecurityCode': [this.payment.CreditCard.SecurityCode, [Validators.required]],
      'creditCardHolder': [this.payment.CreditCard.Holder, [Validators.required]],
      'creditCardInstallments': [this.payment.Installments, [Validators.required]]
    });
  }

  private initFormBuilderDebitCard(): void {
    this.formForSaleDebitCard = this.formBuilder.group({
      'debitCardBrand': [this.payment.DebitCard.Brand, [Validators.required]],
      'debitCardNumber': [this.payment.DebitCard.CardNumber, [Validators.required,
        Validators.minLength(16)]],
      'debitCardExpirationDate': [this.payment.DebitCard.ExpirationDate, [Validators.required]],
      'debitCardSecurityCode': [this.payment.DebitCard.SecurityCode, [Validators.required]],
      'debitCardHolder': [this.payment.DebitCard.Holder, [Validators.required]],
    });
  }

  public doPayment() {
    let amountSplited = this.amountString.toString().split(".");
    // Exemplo: R$ 1
    if (this.amountString.toString().length == 1) {
      this.payment.Amount = parseInt(this.amountString + "00");
    }
    // Ex: 0,01
    if (this.amountString.toString().indexOf("0.0") !== -1 && this.amountString.toString().length === 4) {
      this.payment.Amount = parseInt(this.amountString.toString().charAt(3));
    }
    // Exemplo: R$ 0,1
    if (this.amountString.toString().length === 3 && amountSplited !== undefined && amountSplited.length === 2) {
      this.payment.Amount = parseInt(amountSplited[0] + amountSplited[1] + "0");
    }
    if (this.amountString.toString().indexOf('.') === -1) {
      this.payment.Amount = parseInt(this.amountString.toString() + "00");
    }
    if (this.amountString.toString().length > 3 && amountSplited !== undefined && amountSplited.length === 2) {
      this.payment.Amount = parseInt(amountSplited[0] + amountSplited[1]);
    }
    this.cieloPaymentService.getOrderId().subscribe(countId => {
      let countOrderId = countId + 1;
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
          MerchantOrderId: countOrderId.toString(),
          Customer: {
            Name: this.client.name
          },
          Payment: copyPayment
        };
        this.billToPayService.paymentCreditCard(creditCardPayment).subscribe(cieloPaymentReturn => {
          if (cieloPaymentReturn.Payment.Status === 1 || cieloPaymentReturn.Payment.Status === 2) {
            let toastOptions: ToastOptions = {
              title: "Pagamento Realizado",
              showClose: true,
              timeout: 4000
            };
            this.toastyService.success(toastOptions);
            this.saveCieloPayment(cieloPaymentReturn, undefined, countOrderId);
          } else {
            this.stopSlimLoadingBar();
            this.showMsgError(parseInt(cieloPaymentReturn.Payment.ReturnCode), cieloPaymentReturn.Payment.ReturnMessage);
            $('#btnDoPaymentForSaleCreditCard').prop("disabled",false);
          }
          $('#btnDoPaymentForSaleCreditCard').prop("disabled",false);
        }, error => {
          this.handleError(error);
          $('#btnDoPaymentForSaleCreditCard').prop("disabled",false);
        });
      } else if (this.paymentMethod === 'DEBIT') {
        $('#btnDoPaymentForSaleDebitCard').prop("disabled",true);
        let debitPayment = {
          MerchantOrderId: countOrderId.toString(),
          Customer: {
            Name: this.client.name
          },
          Payment: {
            Type: "DebitCard",
            Amount: this.payment.Amount,
            ReturnUrl: "http://localhost:4200",
            DebitCard: this.payment.DebitCard
          }
        };
        console.log(JSON.stringify(debitPayment));
        /*this.billToPayService.paymentDebitCard(debitPayment).subscribe(cieloPaymentReturn => {
          if (cieloPaymentReturn.Payment.Status === 1 || cieloPaymentReturn.Payment.Status === 2) {
            let toastOptions: ToastOptions = {
              title: "Pagamento Realizado",
              showClose: true,
              timeout: 4000
            };
            this.toastyService.success(toastOptions);
            this.saveCieloPayment(cieloPaymentReturn, undefined, countOrderId);
            $('#btnDoPaymentForSaleDebitCard').prop("disabled",false);
          } else {
            let toastOptions: ToastOptions = {
              title: cieloPaymentReturn.Payment.ReturnMessage,
              showClose: true,
              timeout: 4000
            };
            this.toastyService.error(toastOptions);
            $('#btnDoPaymentForSaleDebitCard').prop("disabled",false);
          }

        }, error => {
          this.handleError(error);
          $('#btnDoPaymentForSaleDebitCard').prop("disabled",false);
        })*/
      }
    }, error => {
      this.handleError(error);
    });
  }

  private handleError(error) {
    this.stopSlimLoadingBar();
    if (error.json().length > 0) {
      error.json().forEach(error => {
        this.showMsgError(error.Code, error.Message);
      });
    } else if (error.json() !== undefined) {
      this.showMsgError(error.json().Code, error.json().Message);
    } else if (error.status !== undefined && error.statusTesxt !== undefined) {
      this.showMsgError(error.status, error.statusTesxt);
    }
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

  private saveCieloPayment(cieloPaymentReturn: any, cardToken: string, countOrderId: any): void {
    this.cieloPayment = Constants.getCiloPaymentConverted(cieloPaymentReturn, cardToken, true);
    this.cieloPayment.description = this.paymentDescription;
    this.cieloPayment.clientId = this.route.snapshot.params['clientId'];
    this.cieloPayment.recurrent = false;
    this.cieloPayment.cieloPaymentCards.saveCard = false;
    this.cieloPayment.countOrderId = countOrderId;
    this.cieloPaymentService.create(this.cieloPayment, true).subscribe(() => {
      this.stopSlimLoadingBar();
      this.modalReceiptForSale.show();
    }, error => {
      this.handleError(error);
    });
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

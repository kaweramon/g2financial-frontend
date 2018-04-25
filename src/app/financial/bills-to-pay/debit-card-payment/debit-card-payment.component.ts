import {Component, Input} from '@angular/core';
import {Payment} from '../payment';
import {DebitCard} from './debit-card';
import {BillToPayService} from '../bill-to-pay.service';
import {ToastOptions, ToastyConfig, ToastyService} from 'ng2-toasty';
import {ClientService} from '../../../search-client/client.service';
import {ActivatedRoute} from '@angular/router';
import {BillToPayPaymentService} from '../bill-to-pay-payment.service';
import {BillToPayAmountsPaidService} from '../bill-to-pay-amounts-paid.service';
import {BillToPayAmountsPaid} from '../bill-to-pay-amounts-paid';
import {Constants} from '../../../util/constants';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import * as $ from 'jquery';

@Component({
  selector: 'app-debit-card-payment',
  templateUrl: './debit-card-payment.component.html',
  styleUrls: ['./debit-card-payment.component.css']
})
export class DebitCardPaymentComponent {

  public payment: Payment;

  public maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public maskSecurityCode = [/[0-9]/, /\d/, /\d/];

  @Input()
  public totalPayment: number;

  @Input()
  public listBillToPayPayment: Array<any>;

  constructor(private service: BillToPayService, private toastyService:ToastyService,
              private route: ActivatedRoute, private billToPayPaymentService: BillToPayPaymentService,
              private toastyConfig: ToastyConfig, private clientService: ClientService,
              private slimLoadingBarService: SlimLoadingBarService,
              private billToPayAmountPaidService: BillToPayAmountsPaidService) {
    this.payment = new Payment();
    this.payment.DebitCard =  new DebitCard();
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = 'top-right';
  }

  public doPayment(): void {
    $('#btnDoPaymentDebitCard').prop("disabled",true);
    this.payment.Type = "DebitCard";
    this.payment.Amount = 5;
    this.payment.ReturnUrl = "http://localhost:4200";
    this.slimLoadingBarService.start();
    this.clientService.view(this.route.snapshot.params["clientId"]).subscribe(client => {
      let debitPayment = {
        MerchantOrderId: "2014121201",
        Customer: {
          Name: client.name
        },
        Payment: {
          Type: "DebitCard",
          ReturnUrl: "http://localhost:4200",
          Amount: 5,
          DebitCard: this.payment.DebitCard
        }
      };
      console.log(JSON.stringify(debitPayment));
      /*this.service.paymentDebitCard(debitPayment).subscribe(cieloPaymentReturn => {
        console.log(cieloPaymentReturn);
        // if (cieloPaymentReturn.Payment.ReturnCode === "4") {
          this.saveListBillToPayPayment();
          this.saveListBillToPayAmountsPaid();
        $('#btnDoPaymentDebitCard').prop("disabled",false);
          let toastOptions: ToastOptions = {
            title: "Pagamento Realizado",
            showClose: true,
            timeout: 4000
          };
          this.toastyService.success(toastOptions);
          this.stopSlimLoadingBar();
        // }
      }, error => {
        $('#btnDoPaymentDebitCard').prop("disabled",false);
        this.stopSlimLoadingBar();
        if (error.json().length > 0) {
          error.json().forEach(error => {
            this.showMsgError(error.Code, error.Message);
          });
        } else if (error.json() !== undefined) {
          this.showMsgError(error.json().Code, error.json().Message);
        }
      })*/
    });

  }

  private saveListBillToPayPayment(): void {
    this.billToPayPaymentService.updateList(this.listBillToPayPayment).subscribe(() => {
    }, error => {
      this.showMsgError(error.join().status, error.json().message);
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

  private stopSlimLoadingBar(): void {
    this.slimLoadingBarService.stop();
    this.slimLoadingBarService.complete();
  }

}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var payment_1 = require("../payment");
var debit_card_1 = require("./debit-card");
var bill_to_pay_amounts_paid_1 = require("../bill-to-pay-amounts-paid");
var constants_1 = require("../../../util/constants");
var $ = require("jquery");
var DebitCardPaymentComponent = (function () {
    function DebitCardPaymentComponent(service, toastyService, route, billToPayPaymentService, toastyConfig, clientService, slimLoadingBarService, billToPayAmountPaidService) {
        this.service = service;
        this.toastyService = toastyService;
        this.route = route;
        this.billToPayPaymentService = billToPayPaymentService;
        this.toastyConfig = toastyConfig;
        this.clientService = clientService;
        this.slimLoadingBarService = slimLoadingBarService;
        this.billToPayAmountPaidService = billToPayAmountPaidService;
        this.maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
        this.maskSecurityCode = [/[0-9]/, /\d/, /\d/];
        this.payment = new payment_1.Payment();
        this.payment.DebitCard = new debit_card_1.DebitCard();
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.position = 'top-right';
    }
    DebitCardPaymentComponent.prototype.doPayment = function () {
        var _this = this;
        $('#btnDoPaymentDebitCard').prop("disabled", true);
        this.payment.Type = "DebitCard";
        this.payment.Amount = 5;
        this.payment.ReturnUrl = "http://localhost:4200";
        this.slimLoadingBarService.start();
        this.clientService.view(this.route.snapshot.params["clientId"]).subscribe(function (client) {
            var debitPayment = {
                MerchantOrderId: "2014121201",
                Customer: {
                    Name: client.name
                },
                Payment: {
                    Type: "DebitCard",
                    ReturnUrl: "http://localhost:4200",
                    Amount: 5,
                    DebitCard: _this.payment.DebitCard
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
    };
    DebitCardPaymentComponent.prototype.saveListBillToPayPayment = function () {
        var _this = this;
        this.billToPayPaymentService.updateList(this.listBillToPayPayment).subscribe(function () {
        }, function (error) {
            _this.showMsgError(error.join().status, error.json().message);
        });
    };
    DebitCardPaymentComponent.prototype.saveListBillToPayAmountsPaid = function () {
        var listBillToPayAmountsPaid = [];
        this.listBillToPayPayment.forEach(function (billToPayPayment) {
            var billToPayAmountsPaid = new bill_to_pay_amounts_paid_1.BillToPayAmountsPaid();
            billToPayAmountsPaid.billToPayPaymentId = billToPayPayment.id;
            billToPayAmountsPaid.hour = new Date();
            billToPayAmountsPaid.date = new Date();
            billToPayAmountsPaid.amount = billToPayPayment.subTotal;
            listBillToPayAmountsPaid.push(billToPayAmountsPaid);
        });
        this.billToPayAmountPaidService.saveList(listBillToPayAmountsPaid).subscribe(function (result) {
        }, function (error) {
        });
    };
    DebitCardPaymentComponent.prototype.showMsgError = function (code, message) {
        switch (code) {
            case 57:
                this.toastyService.error({ title: constants_1.Constants.MSG_ERROR_57_CARD_EXPIRED, showClose: true, timeout: 7000 });
                break;
            case 108:
                this.toastyService.error({ title: constants_1.Constants.MSG_ERROR_108_AMOUNT_GREATER_THAN_ZERO, showClose: true, timeout: 7000 });
                break;
            case 117:
                this.toastyService.error({ title: constants_1.Constants.MSG_ERROR_117_HOLDER_IS_REQUIRED, showClose: true, timeout: 7000 });
                break;
            case 118:
                this.toastyService.error({ title: constants_1.Constants.MSG_ERROR_118_CREDIT_CARD_NUMBER_REQUIRED, showClose: true, timeout: 7000 });
                break;
            case 125:
                this.toastyService.error({ title: constants_1.Constants.MSG_ERROR_125_CREDIT_CARD_EXPIRATION_DATE_REQUIRED, showClose: true, timeout: 7000 });
                break;
            case 126:
                this.toastyService.error({ title: constants_1.Constants.MSG_ERROR_126_CREDIT_CARD_EXPIRATION_DATE_IS_INVALID, showClose: true, timeout: 7000 });
                break;
            case 127:
                this.toastyService.error({ title: constants_1.Constants.MSG_ERROR_127_CREDIT_CARD_NUMBER_IS_REQUIRED, showClose: true, timeout: 7000 });
                break;
            case 128:
                this.toastyService.error({ title: constants_1.Constants.MSG_ERROR_128_CREDIT_CARD_NUMBER_LENGHT_EXCEEDED, showClose: true, timeout: 7000 });
                break;
            default:
                this.toastyService.error({ title: message, showClose: true, timeout: 7000 });
        }
    };
    DebitCardPaymentComponent.prototype.stopSlimLoadingBar = function () {
        this.slimLoadingBarService.stop();
        this.slimLoadingBarService.complete();
    };
    return DebitCardPaymentComponent;
}());
__decorate([
    core_1.Input()
], DebitCardPaymentComponent.prototype, "totalPayment", void 0);
__decorate([
    core_1.Input()
], DebitCardPaymentComponent.prototype, "listBillToPayPayment", void 0);
DebitCardPaymentComponent = __decorate([
    core_1.Component({
        selector: 'app-debit-card-payment',
        templateUrl: './debit-card-payment.component.html',
        styleUrls: ['./debit-card-payment.component.css']
    })
], DebitCardPaymentComponent);
exports.DebitCardPaymentComponent = DebitCardPaymentComponent;
//# sourceMappingURL=debit-card-payment.component.js.map
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
var moment = require("moment");
var bill_to_pay_amounts_paid_1 = require("../bill-to-pay-amounts-paid");
var cielo_payment_1 = require("../cielo-payment");
var cielo_payment_cards_1 = require("../cielo-payment-cards");
var $ = require("jquery");
var constants_1 = require("../../../util/constants");
var RecurrentPaymentComponent = (function () {
    function RecurrentPaymentComponent(billToPayService, route, clientService, billToPayAmountPaidService, toastyService, toastyConfig, slimLoadingBarService, billToPayPaymentService, cieloPaymentService) {
        this.billToPayService = billToPayService;
        this.route = route;
        this.clientService = clientService;
        this.billToPayAmountPaidService = billToPayAmountPaidService;
        this.toastyService = toastyService;
        this.toastyConfig = toastyConfig;
        this.slimLoadingBarService = slimLoadingBarService;
        this.billToPayPaymentService = billToPayPaymentService;
        this.cieloPaymentService = cieloPaymentService;
        this.maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
        this.maskSecurityCode = [/[0-9]/, /\d/, /\d/];
        this.payment = new payment_1.Payment();
        this.payment.Installments = 1;
        this.payment.RecurrentPayment.Interval = "Annual";
        this.getClient();
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.position = 'top-right';
        this.checkFuturePayments = true;
    }
    RecurrentPaymentComponent.prototype.getClient = function () {
        var _this = this;
        this.clientService.view(this.route.snapshot.params['clientId']).subscribe(function (client) {
            _this.client = client;
        });
    };
    RecurrentPaymentComponent.prototype.doPayment = function () {
        var _this = this;
        $('#btnDoPayment').prop("disabled", true);
        this.payment.Type = "CreditCard";
        this.payment.Amount = this.totalPayment;
        this.payment.SoftDescriptor = "TESTE";
        this.slimLoadingBarService.start();
        var copyPayment = Object.assign({}, this.payment);
        copyPayment.DebitCard = undefined;
        copyPayment.RecurrentPayment = undefined;
        var creditCardPayment = {
            MerchantOrderId: "2014113245231706",
            Customer: {
                Name: this.client.name
            },
            Payment: copyPayment
        };
        this.billToPayService.paymentCreditCard(creditCardPayment).subscribe(function (cieloPaymentReturn) {
            if (cieloPaymentReturn.Payment.ReturnCode === "4") {
                _this.saveListBillToPayPayment();
                _this.saveListBillToPayAmountsPaid();
                if (_this.checkFuturePayments) {
                    _this.saveCardToken(cieloPaymentReturn);
                }
                else {
                    _this.saveCieloPayment(cieloPaymentReturn, undefined);
                }
            }
            else {
                _this.stopSlimLoadingBar();
                _this.showMsgError(parseInt(cieloPaymentReturn.Payment.ReturnCode), cieloPaymentReturn.Payment.ReturnMessage);
            }
            $('#btnDoPayment').prop("disabled", false);
        }, function (error) {
            _this.stopSlimLoadingBar();
            if (error.json().length > 0) {
                error.json().forEach(function (error) {
                    _this.showMsgError(error.Code, error.Message);
                });
            }
            else if (error.json() !== undefined) {
                _this.showMsgError(error.json().Code, error.json().Message);
            }
            $('#btnDoPayment').prop("disabled", false);
        });
    };
    RecurrentPaymentComponent.prototype.saveCardToken = function (cieloPaymentReturn) {
        var _this = this;
        var cardTokenRequest = {
            CustomerName: this.client.name,
            CardNumber: this.payment.CreditCard.CardNumber,
            Holder: this.payment.CreditCard.Holder,
            ExpirationDate: this.payment.CreditCard.ExpirationDate,
            Brand: this.payment.CreditCard.Brand
        };
        this.billToPayService.createCardToken(cardTokenRequest).subscribe(function (result) {
            _this.saveCieloPayment(cieloPaymentReturn, result.CardToken);
        }, function (error) {
            _this.stopSlimLoadingBar();
            if (error.json().length > 0) {
                error.json().forEach(function (error) {
                    _this.showMsgError(error.Code, error.Message);
                });
            }
            else if (error.json() !== undefined) {
                _this.showMsgError(error.json().Code, error.json().Message);
            }
        });
    };
    RecurrentPaymentComponent.prototype.stopSlimLoadingBar = function () {
        this.slimLoadingBarService.stop();
        this.slimLoadingBarService.complete();
    };
    RecurrentPaymentComponent.prototype.showMsgError = function (code, message) {
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
    RecurrentPaymentComponent.prototype.saveListBillToPayPayment = function () {
        var _this = this;
        this.billToPayPaymentService.updateList(this.listBillToPayPayment).subscribe(function (result) {
        }, function (error) {
            _this.showMsgError(error.join().status, error.json().message);
        });
    };
    RecurrentPaymentComponent.prototype.saveCieloPayment = function (cieloPaymentReturn, cardToken) {
        var _this = this;
        this.cieloPayment = new cielo_payment_1.CieloPayment();
        this.cieloPayment.cieloPaymentCards = new cielo_payment_cards_1.CieloPaymentCards();
        this.cieloPayment.clientId = this.route.snapshot.params['clientId'];
        this.cieloPayment.serviceTaxAmount = cieloPaymentReturn.Payment.ServiceTaxAmount !== null ? cieloPaymentReturn.Payment.ServiceTaxAmount : 0.0;
        this.cieloPayment.installments = cieloPaymentReturn.Payment.Installments;
        this.cieloPayment.interest = cieloPaymentReturn.Payment.Interest;
        this.cieloPayment.capture = cieloPaymentReturn.Payment.Capture;
        this.cieloPayment.recurrent = cieloPaymentReturn.Payment.Recurrent;
        this.cieloPayment.amount = cieloPaymentReturn.Payment.Amount;
        this.cieloPayment.authenticate = cieloPaymentReturn.Payment.Authenticate;
        this.cieloPayment.authorizationCode = cieloPaymentReturn.Payment.AuthorizationCode;
        this.cieloPayment.authenticate = cieloPaymentReturn.Payment.Authenticate;
        this.cieloPayment.recurrent = cieloPaymentReturn.Payment.Recurrent;
        //Credit Card
        this.cieloPayment.cieloPaymentCards.cardToken = cardToken !== undefined ? cardToken : '';
        this.cieloPayment.cieloPaymentCards.cardNumber = cieloPaymentReturn !== null ? cieloPaymentReturn.Payment.CreditCard.CardNumber : "";
        this.cieloPayment.cieloPaymentCards.holder = cieloPaymentReturn.Payment.CreditCard.Holder;
        this.cieloPayment.cieloPaymentCards.expirationDate = cieloPaymentReturn.Payment.CreditCard.ExpirationDate;
        this.cieloPayment.cieloPaymentCards.saveCard = cieloPaymentReturn.Payment.CreditCard.SaveCard;
        this.cieloPayment.cieloPaymentCards.brand = cieloPaymentReturn.Payment.CreditCard.Brand;
        this.cieloPayment.tid = cieloPaymentReturn.Payment.Tid;
        this.cieloPayment.proofOfSale = cieloPaymentReturn.Payment.ProofOfSale;
        this.cieloPayment.authorizationCode = cieloPaymentReturn.Payment.AuthorizationCode;
        this.cieloPayment.softDescriptor = cieloPaymentReturn.Payment.SoftDescriptor;
        this.cieloPayment.provider = cieloPaymentReturn.Payment.Provider;
        this.cieloPayment.paymentId = cieloPaymentReturn.Payment.PaymentId;
        this.cieloPayment.type = cieloPaymentReturn.Payment.Type;
        this.cieloPayment.amount = cieloPaymentReturn.Payment.Amount;
        this.cieloPayment.currency = cieloPaymentReturn.Payment.Currency;
        this.cieloPayment.country = cieloPaymentReturn.Payment.Country;
        this.cieloPayment.returnCode = cieloPaymentReturn.Payment.ReturnCode;
        this.cieloPayment.returnMessage = cieloPaymentReturn.Payment.ReturnMessage;
        this.cieloPayment.status = cieloPaymentReturn.Payment.Status;
        this.cieloPayment.cieloPaymentCards.type = cieloPaymentReturn.Payment.Type;
        this.cieloPaymentService.create(this.cieloPayment).subscribe(function (result) {
            _this.stopSlimLoadingBar();
            _this.modalReceipt.show();
        }, function (error) {
        });
    };
    RecurrentPaymentComponent.prototype.saveListBillToPayAmountsPaid = function () {
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
    RecurrentPaymentComponent.prototype.checkRecurrency = function () {
        if (parseInt(this.payment.Installments.toString()) > 1) {
            this.payment.RecurrentPayment.Interval = 'None';
        }
    };
    RecurrentPaymentComponent.prototype.getCurrentDate = function (format) {
        return moment().format(format);
    };
    RecurrentPaymentComponent.prototype.getLast4DigitsFromCard = function () {
        if (this.payment.CreditCard.CardNumber !== undefined) {
            return this.payment.CreditCard.CardNumber.substr(this.payment.CreditCard.CardNumber.length - 4, this.payment.CreditCard.CardNumber.length - 1);
        }
        else {
            return '';
        }
    };
    RecurrentPaymentComponent.prototype.getNumberRecurrentInstalments = function () {
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
    };
    RecurrentPaymentComponent.prototype.getConvertedDate = function (date) {
        return moment(date).format('DD/MM/YYYY');
    };
    RecurrentPaymentComponent.prototype.print = function () {
        var printContents, popupWin;
        printContents = document.getElementById('div-payment-receipt').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write("\n      <html>\n        <head>\n          <title>Comprovante</title>\n        </head>\n    <body onload=\"window.print();window.close()\">" + printContents + "</body>\n      </html>");
        popupWin.document.close();
    };
    return RecurrentPaymentComponent;
}());
__decorate([
    core_1.Input()
], RecurrentPaymentComponent.prototype, "totalPayment", void 0);
__decorate([
    core_1.Input()
], RecurrentPaymentComponent.prototype, "listBillToPayPayment", void 0);
__decorate([
    core_1.ViewChild('modalReceipt')
], RecurrentPaymentComponent.prototype, "modalReceipt", void 0);
RecurrentPaymentComponent = __decorate([
    core_1.Component({
        selector: 'app-recurrent-payment',
        templateUrl: './recurrent-payment.component.html',
        styleUrls: ['./recurrent-payment.component.css']
    })
], RecurrentPaymentComponent);
exports.RecurrentPaymentComponent = RecurrentPaymentComponent;
//# sourceMappingURL=recurrent-payment.component.js.map
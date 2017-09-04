"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var payment_1 = require("../bills-to-pay/payment");
var $ = require("jquery");
var moment = require("moment");
var constants_1 = require("../../util/constants");
var ForSaleComponent = (function () {
    function ForSaleComponent(cieloPaymentService, billToPayService, route, toastyService, toastyConfig, slimLoadingBarService, clientService) {
        var _this = this;
        this.cieloPaymentService = cieloPaymentService;
        this.billToPayService = billToPayService;
        this.route = route;
        this.toastyService = toastyService;
        this.toastyConfig = toastyConfig;
        this.slimLoadingBarService = slimLoadingBarService;
        this.clientService = clientService;
        this.maskSecurityCode = [/[0-9]/, /\d/, /\d/];
        this.maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
        this.payment = new payment_1.Payment();
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.position = 'top-right';
        this.clientService.view(this.route.snapshot.params['clientId']).subscribe(function (client) {
            _this.client = client;
        });
    }
    ForSaleComponent.prototype.doPayment = function () {
        var _this = this;
        if (this.paymentMethod === 'CREDIT') {
            $('#btnDoPaymentForSaleCreditCard').prop("disabled", true);
            this.payment.Type = "CreditCard";
            if (this.client.name.length > 13) {
                this.payment.SoftDescriptor = this.client.name.substring(0, 13);
            }
            else {
                this.payment.SoftDescriptor = this.client.name;
            }
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
                    var toastOptions = {
                        title: "Pagamento Realizado",
                        showClose: true,
                        timeout: 4000
                    };
                    _this.toastyService.success(toastOptions);
                    _this.saveCieloPayment(cieloPaymentReturn, undefined);
                }
                else {
                    _this.stopSlimLoadingBar();
                    _this.showMsgError(parseInt(cieloPaymentReturn.Payment.ReturnCode), cieloPaymentReturn.Payment.ReturnMessage);
                }
                $('#btnDoPaymentForSaleCreditCard').prop("disabled", false);
            }, function (error) {
                _this.handleError(error);
            });
        }
        else if (this.paymentMethod === 'DEBIT') {
            var debitPayment = {
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
            this.billToPayService.paymentDebitCard(debitPayment).subscribe(function (cieloPaymentReturn) {
                var toastOptions = {
                    title: "Pagamento Realizado",
                    showClose: true,
                    timeout: 4000
                };
                _this.toastyService.success(toastOptions);
                _this.saveCieloPayment(cieloPaymentReturn, undefined);
            }, function (error) {
                _this.handleError(error);
            });
        }
    };
    ForSaleComponent.prototype.handleError = function (error) {
        var _this = this;
        this.stopSlimLoadingBar();
        console.log(error);
        if (error.json().length > 0) {
            error.json().forEach(function (error) {
                _this.showMsgError(error.Code, error.Message);
            });
        }
        else if (error.json() !== undefined) {
            this.showMsgError(error.json().Code, error.json().Message);
        }
        $('#btnDoPayment').prop("disabled", false);
    };
    ForSaleComponent.prototype.stopSlimLoadingBar = function () {
        this.slimLoadingBarService.stop();
        this.slimLoadingBarService.complete();
    };
    ForSaleComponent.prototype.showMsgError = function (code, message) {
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
    ForSaleComponent.prototype.saveCieloPayment = function (cieloPaymentReturn, cardToken) {
        var _this = this;
        this.cieloPayment = constants_1.Constants.getCiloPaymentConverted(cieloPaymentReturn, cardToken, true);
        this.cieloPayment.description = this.paymentDescription;
        this.cieloPayment.clientId = this.route.snapshot.params['clientId'];
        console.log(this.cieloPayment);
        this.cieloPaymentService.create(this.cieloPayment, true).subscribe(function () {
            _this.stopSlimLoadingBar();
            console.log("showModal");
            console.log(_this.modalReceiptForSale);
            _this.modalReceiptForSale.show();
        }, function (error) {
        });
    };
    ForSaleComponent.prototype.getCurrentDate = function (format) {
        return moment().format(format);
    };
    ForSaleComponent.prototype.getConvertedDate = function (date) {
        return moment(date).format('DD/MM/YYYY');
    };
    ForSaleComponent.prototype.getLast4DigitsFromCard = function () {
        if (this.payment.CreditCard.CardNumber !== undefined) {
            return this.payment.CreditCard.CardNumber.substr(this.payment.CreditCard.CardNumber.length - 4, this.payment.CreditCard.CardNumber.length - 1);
        }
        else if (this.payment.DebitCard.CardNumber !== undefined) {
            return this.payment.DebitCard.CardNumber.substr(this.payment.DebitCard.CardNumber.length - 4, this.payment.DebitCard.CardNumber.length - 1);
        }
        else {
            return '';
        }
    };
    ForSaleComponent.prototype.print = function () {
        var printContents, popupWin;
        printContents = document.getElementById('div-payment-receipt-for-sale').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=100%');
        popupWin.document.open();
        popupWin.document.write("\n      <html>\n        <head>\n          <title>Comprovante</title>\n          <style>\n            #div-payment-receipt-for-sale {\n              float: none;\n              margin: 0 auto;\n              background-color: #EBFAFF;\n              max-width: 250px;\n            }\n            p {\n              font-size: 11px;\n              margin: 0;\n            }\n\n          </style>\n        </head>\n    <body onload=\"window.print();window.close()\">" + printContents + "</body>\n      </html>");
        popupWin.document.close();
    };
    return ForSaleComponent;
}());
__decorate([
    core_1.ViewChild('modalReceiptForSale')
], ForSaleComponent.prototype, "modalReceiptForSale", void 0);
ForSaleComponent = __decorate([
    core_1.Component({
        selector: 'app-for-sale',
        templateUrl: './for-sale.component.html',
        styleUrls: ['./for-sale.component.css']
    })
], ForSaleComponent);
exports.ForSaleComponent = ForSaleComponent;
//# sourceMappingURL=for-sale.component.js.map
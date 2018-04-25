"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var payment_1 = require("../bills-to-pay/payment");
var $ = require("jquery");
var moment = require("moment");
var constants_1 = require("../../util/constants");
var forms_1 = require("@angular/forms");
var ForSaleComponent = (function () {
    function ForSaleComponent(cieloPaymentService, billToPayService, route, toastyService, toastyConfig, slimLoadingBarService, clientService, formBuilder) {
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
        this.formBuilder = formBuilder;
        this.initFormBuilder();
        this.initFormBuilderDebitCard();
        this.initFormBuilderCreditCard();
        this.clientService.view(this.route.snapshot.params['clientId']).subscribe(function (client) {
            _this.client = client;
        });
    }
    ForSaleComponent.prototype.initFormBuilder = function () {
        this.formForSale = this.formBuilder.group({
            'paymentDescription': [this.paymentDescription, [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
            'amountString': [this.amountString, [forms_1.Validators.required]],
            'paymentMethod': [this.paymentMethod]
        });
    };
    ForSaleComponent.prototype.initFormBuilderCreditCard = function () {
        this.formForSaleCreditCard = this.formBuilder.group({
            'creditCardBrand': [this.payment.CreditCard.Brand, [forms_1.Validators.required]],
            'creditCardNumber': [this.payment.CreditCard.CardNumber, [forms_1.Validators.required,
                    forms_1.Validators.minLength(16)]],
            'creditCardExpirationDate': [this.payment.CreditCard.ExpirationDate, [forms_1.Validators.required]],
            'creditCardSecurityCode': [this.payment.CreditCard.SecurityCode, [forms_1.Validators.required]],
            'creditCardHolder': [this.payment.CreditCard.Holder, [forms_1.Validators.required]],
            'creditCardInstallments': [this.payment.Installments, [forms_1.Validators.required]]
        });
    };
    ForSaleComponent.prototype.initFormBuilderDebitCard = function () {
        this.formForSaleDebitCard = this.formBuilder.group({
            'debitCardBrand': [this.payment.DebitCard.Brand, [forms_1.Validators.required]],
            'debitCardNumber': [this.payment.DebitCard.CardNumber, [forms_1.Validators.required,
                    forms_1.Validators.minLength(16)]],
            'debitCardExpirationDate': [this.payment.DebitCard.ExpirationDate, [forms_1.Validators.required]],
            'debitCardSecurityCode': [this.payment.DebitCard.SecurityCode, [forms_1.Validators.required]],
            'debitCardHolder': [this.payment.DebitCard.Holder, [forms_1.Validators.required]],
        });
    };
    ForSaleComponent.prototype.doPayment = function () {
        var _this = this;
        var amountSplited = this.amountString.toString().split(".");
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
        this.cieloPaymentService.getOrderId().subscribe(function (countId) {
            var countOrderId = countId + 1;
            if (_this.paymentMethod === 'CREDIT') {
                $('#btnDoPaymentForSaleCreditCard').prop("disabled", true);
                _this.payment.Type = "CreditCard";
                if (_this.client.name.length > 13) {
                    _this.payment.SoftDescriptor = _this.client.name.substring(0, 13);
                }
                else {
                    _this.payment.SoftDescriptor = _this.client.name;
                }
                _this.slimLoadingBarService.start();
                var copyPayment = Object.assign({}, _this.payment);
                copyPayment.DebitCard = undefined;
                copyPayment.RecurrentPayment = undefined;
                var creditCardPayment = {
                    MerchantOrderId: countOrderId.toString(),
                    Customer: {
                        Name: _this.client.name
                    },
                    Payment: copyPayment
                };
                _this.billToPayService.paymentCreditCard(creditCardPayment).subscribe(function (cieloPaymentReturn) {
                    if (cieloPaymentReturn.Payment.Status === 1 || cieloPaymentReturn.Payment.Status === 2) {
                        var toastOptions = {
                            title: "Pagamento Realizado",
                            showClose: true,
                            timeout: 4000
                        };
                        _this.toastyService.success(toastOptions);
                        _this.saveCieloPayment(cieloPaymentReturn, undefined, countOrderId);
                    }
                    else {
                        _this.stopSlimLoadingBar();
                        _this.showMsgError(parseInt(cieloPaymentReturn.Payment.ReturnCode), cieloPaymentReturn.Payment.ReturnMessage);
                        $('#btnDoPaymentForSaleCreditCard').prop("disabled", false);
                    }
                    $('#btnDoPaymentForSaleCreditCard').prop("disabled", false);
                }, function (error) {
                    _this.handleError(error);
                    $('#btnDoPaymentForSaleCreditCard').prop("disabled", false);
                });
            }
            else if (_this.paymentMethod === 'DEBIT') {
                $('#btnDoPaymentForSaleDebitCard').prop("disabled", true);
                var debitPayment = {
                    MerchantOrderId: countOrderId.toString(),
                    Customer: {
                        Name: _this.client.name
                    },
                    Payment: {
                        Type: "DebitCard",
                        Amount: _this.payment.Amount,
                        ReturnUrl: "http://localhost:4200",
                        DebitCard: _this.payment.DebitCard
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
        }, function (error) {
            _this.handleError(error);
        });
    };
    ForSaleComponent.prototype.handleError = function (error) {
        var _this = this;
        this.stopSlimLoadingBar();
        if (error.json().length > 0) {
            error.json().forEach(function (error) {
                _this.showMsgError(error.Code, error.Message);
            });
        }
        else if (error.json() !== undefined) {
            this.showMsgError(error.json().Code, error.json().Message);
        }
        else if (error.status !== undefined && error.statusTesxt !== undefined) {
            this.showMsgError(error.status, error.statusTesxt);
        }
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
    ForSaleComponent.prototype.saveCieloPayment = function (cieloPaymentReturn, cardToken, countOrderId) {
        var _this = this;
        this.cieloPayment = constants_1.Constants.getCiloPaymentConverted(cieloPaymentReturn, cardToken, true);
        this.cieloPayment.description = this.paymentDescription;
        this.cieloPayment.clientId = this.route.snapshot.params['clientId'];
        this.cieloPayment.recurrent = false;
        this.cieloPayment.cieloPaymentCards.saveCard = false;
        this.cieloPayment.countOrderId = countOrderId;
        this.cieloPaymentService.create(this.cieloPayment, true).subscribe(function () {
            _this.stopSlimLoadingBar();
            _this.modalReceiptForSale.show();
        }, function (error) {
            _this.handleError(error);
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
    }),
    __param(7, core_1.Inject(forms_1.FormBuilder))
], ForSaleComponent);
exports.ForSaleComponent = ForSaleComponent;
//# sourceMappingURL=for-sale.component.js.map
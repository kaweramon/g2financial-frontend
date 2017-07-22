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
var DebitCardPaymentComponent = (function () {
    function DebitCardPaymentComponent(service, toastyService, toastyConfig) {
        this.service = service;
        this.toastyService = toastyService;
        this.toastyConfig = toastyConfig;
        this.maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
        this.maskSecurityCode = [/[0-9]/, /\d/, /\d/];
        this.payment = new payment_1.Payment();
        this.payment.DebitCard = new debit_card_1.DebitCard();
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.position = 'top-right';
    }
    DebitCardPaymentComponent.prototype.doPayment = function () {
        var _this = this;
        this.payment.Type = "DebitCard";
        this.payment.Amount = 5;
        this.payment.ReturnUrl = "http://localhost:4200";
        var debitPayment = {
            MerchantOrderId: "2014121201",
            Payment: this.payment
        };
        this.service.paymentDebitCard(debitPayment).subscribe(function (result) {
            var toastOptions = {
                title: "Pagamento Realizado",
                showClose: true,
                timeout: 4000
            };
            _this.toastyService.success(toastOptions);
        }, function (error) {
            console.log(error);
        });
    };
    return DebitCardPaymentComponent;
}());
__decorate([
    core_1.Input()
], DebitCardPaymentComponent.prototype, "totalPayment", void 0);
DebitCardPaymentComponent = __decorate([
    core_1.Component({
        selector: 'app-debit-card-payment',
        templateUrl: './debit-card-payment.component.html',
        styleUrls: ['./debit-card-payment.component.css']
    })
], DebitCardPaymentComponent);
exports.DebitCardPaymentComponent = DebitCardPaymentComponent;
//# sourceMappingURL=debit-card-payment.component.js.map
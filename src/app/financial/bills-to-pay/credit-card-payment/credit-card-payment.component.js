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
var credit_card_1 = require("./credit-card");
var CreditCardPaymentComponent = (function () {
    function CreditCardPaymentComponent() {
        this.maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
        this.maskSecurityCode = [/[0-9]/, /\d/, /\d/];
        this.payment = new payment_1.Payment();
        this.payment.CreditCard = new credit_card_1.CreditCard();
    }
    return CreditCardPaymentComponent;
}());
__decorate([
    core_1.Input()
], CreditCardPaymentComponent.prototype, "totalPayment", void 0);
CreditCardPaymentComponent = __decorate([
    core_1.Component({
        selector: 'app-credit-card-payment',
        templateUrl: './credit-card-payment.component.html',
        styleUrls: ['./credit-card-payment.component.css']
    })
], CreditCardPaymentComponent);
exports.CreditCardPaymentComponent = CreditCardPaymentComponent;
//# sourceMappingURL=credit-card-payment.component.js.map
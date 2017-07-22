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
var RecurrentPaymentComponent = (function () {
    function RecurrentPaymentComponent(billToPayService, route, clientService) {
        this.billToPayService = billToPayService;
        this.route = route;
        this.clientService = clientService;
        this.maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
        this.maskSecurityCode = [/[0-9]/, /\d/, /\d/];
        this.payment = new payment_1.Payment();
        this.getClient();
    }
    RecurrentPaymentComponent.prototype.getClient = function () {
        var _this = this;
        this.clientService.view(this.route.snapshot.params['clientId']).subscribe(function (client) {
            _this.client = client;
        });
    };
    RecurrentPaymentComponent.prototype.doPayment = function () {
        this.payment.Type = "CreditCard";
        this.payment.Amount = this.totalPayment;
        this.payment.SoftDescriptor = "TESTE";
        this.payment.RecurrentPayment.AuthorizeNow = "true";
        this.payment.RecurrentPayment.EndDate = moment().add(1, 'years').format('YYYY-MM-DD');
        this.payment.RecurrentPayment.Interval = "Annual";
        var recurrentPayment = {
            MerchantOrderId: "2014113245231706",
            Customer: {
                Name: this.client.name
            },
            Payment: this.payment
        };
        this.billToPayService.paymentRecurrentCard(recurrentPayment).subscribe(function (result) {
            console.log(result);
        }, function (error) {
            console.log(error);
        });
    };
    return RecurrentPaymentComponent;
}());
__decorate([
    core_1.Input()
], RecurrentPaymentComponent.prototype, "totalPayment", void 0);
RecurrentPaymentComponent = __decorate([
    core_1.Component({
        selector: 'app-recurrent-payment',
        templateUrl: './recurrent-payment.component.html',
        styleUrls: ['./recurrent-payment.component.css']
    })
], RecurrentPaymentComponent);
exports.RecurrentPaymentComponent = RecurrentPaymentComponent;
//# sourceMappingURL=recurrent-payment.component.js.map
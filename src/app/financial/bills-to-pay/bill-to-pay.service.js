"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var BillToPayService = (function () {
    function BillToPayService(http) {
        this.http = http;
        this.urlBillToPay = 'http://localhost:8080/bill-to-pay/';
        this.urlSandBox = 'https://apisandbox.cieloecommerce.cielo.com.br/1/sales';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.params = new http_1.URLSearchParams();
    }
    BillToPayService.prototype.listByClientId = function (clientId, isBillToPay) {
        this.params.set('clientId', clientId.toString());
        this.params.set('isBillToPay', isBillToPay);
        return this.http.get(this.urlBillToPay + clientId, { headers: this.headers, search: this.params }).map(function (res) { return res.json(); });
    };
    BillToPayService.prototype.paymentCreditCard = function (payment) {
        console.log(payment);
        this.params = new http_1.URLSearchParams();
        this.setMerchantIdAndKey();
        return this.http.post(this.urlSandBox, payment, { headers: this.headers, search: this.params }).map(function (res) { return res.json(); });
    };
    BillToPayService.prototype.paymentDebitCard = function (payment) {
        this.setMerchantIdAndKey();
        return this.http.post(this.urlSandBox, payment, { headers: this.headers }).map(function (res) { return res.json(); });
    };
    BillToPayService.prototype.paymentRecurrentCard = function (payment) {
        this.setMerchantIdAndKey();
        return this.http.post(this.urlSandBox, payment, { headers: this.headers }).map(function (res) { return res.json(); });
    };
    BillToPayService.prototype.setMerchantIdAndKey = function () {
        this.headers.set('MerchantId', 'fe17c77b-df00-4ad4-a8e7-378dfc41cf96');
        this.headers.set('MerchantKey', 'TCCBVGXPLLJHJFGQBFPDUWFBNSPLLJTAZAMXJWJK');
    };
    return BillToPayService;
}());
BillToPayService = __decorate([
    core_1.Injectable()
], BillToPayService);
exports.BillToPayService = BillToPayService;
//# sourceMappingURL=bill-to-pay.service.js.map
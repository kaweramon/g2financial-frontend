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
var CieloPaymentService = (function () {
    function CieloPaymentService(http) {
        this.http = http;
        this.urlCieloPayment = 'http://localhost:8080/cielo-payment/';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.params = new http_1.URLSearchParams();
    }
    CieloPaymentService.prototype.create = function (cieloPayment, isForSale) {
        this.params.set('isForSale', isForSale);
        return this.http.post(this.urlCieloPayment, cieloPayment, { headers: this.headers, search: this.params }).map(function (res) { return res.json(); });
    };
    CieloPaymentService.prototype.getOrderId = function () {
        return this.http.get(this.urlCieloPayment + "count-order-id/", { headers: this.headers }).map(function (res) { return res.json(); });
    };
    return CieloPaymentService;
}());
CieloPaymentService = __decorate([
    core_1.Injectable()
], CieloPaymentService);
exports.CieloPaymentService = CieloPaymentService;
//# sourceMappingURL=cielo-payment.service.js.map
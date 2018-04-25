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
var BillToPayAmountsPaidService = (function () {
    function BillToPayAmountsPaidService(http) {
        this.http = http;
        this.urlBillToPayAmountPaid = 'http://localhost:8080/bill-to-pay-amounts-paid/';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.params = new http_1.URLSearchParams();
    }
    BillToPayAmountsPaidService.prototype.create = function (billToPayAmountsPaid) {
        return this.http.post(this.urlBillToPayAmountPaid, billToPayAmountsPaid, { headers: this.headers }).map(function (res) { return res.json(); });
    };
    BillToPayAmountsPaidService.prototype.saveList = function (listBillToPayAmountsPaid) {
        return this.http.post(this.urlBillToPayAmountPaid + "/list", listBillToPayAmountsPaid, { headers: this.headers })
            .map(function (res) { return res.json(); });
    };
    return BillToPayAmountsPaidService;
}());
BillToPayAmountsPaidService = __decorate([
    core_1.Injectable()
], BillToPayAmountsPaidService);
exports.BillToPayAmountsPaidService = BillToPayAmountsPaidService;
//# sourceMappingURL=bill-to-pay-amounts-paid.service.js.map
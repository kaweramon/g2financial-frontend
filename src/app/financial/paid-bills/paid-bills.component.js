"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment");
var PaidBillsComponent = (function () {
    function PaidBillsComponent(route, service) {
        this.route = route;
        this.service = service;
        this.listPaidBills = [];
        this.listBillToPayPayment = [];
    }
    PaidBillsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.listByClientId(this.route.snapshot.params['clientId'], "SIM").subscribe(function (result) {
            _this.listPaidBills = result;
            // this.getListBillToPayPayment();
        });
    };
    PaidBillsComponent.prototype.getListBillToPayPayment = function () {
        var _this = this;
        this.listPaidBills.forEach(function (billToPay) {
            if (billToPay.listBillToPayPayment !== null && billToPay.listBillToPayPayment.length > 0) {
                billToPay.listBillToPayPayment.forEach(function (billToPayPayment) {
                    billToPayPayment.description = billToPay.description;
                    billToPayPayment.isChecked = false;
                    _this.listBillToPayPayment.push(billToPayPayment);
                });
            }
        });
    };
    PaidBillsComponent.prototype.getConvertedDate = function (date) {
        return moment(date).format('DD/MM/YYYY');
    };
    return PaidBillsComponent;
}());
PaidBillsComponent = __decorate([
    core_1.Component({
        selector: 'app-paid-bills',
        templateUrl: './paid-bills.component.html',
        styleUrls: ['./paid-bills.component.css']
    })
], PaidBillsComponent);
exports.PaidBillsComponent = PaidBillsComponent;
//# sourceMappingURL=paid-bills.component.js.map
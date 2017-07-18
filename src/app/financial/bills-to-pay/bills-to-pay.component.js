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
var BillsToPayComponent = (function () {
    function BillsToPayComponent(route, service) {
        var _this = this;
        this.route = route;
        this.service = service;
        this.listBillToPayPayment = [];
        this.listSelectedBillToPayPayment = [];
        this.isPaymentSelected = false;
        this.totalPayment = 0;
        this.maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
        this.maskSecurityCode = [/[0-9]/, /\d/, /\d/];
        this.paymentMethod = '';
        this.service.listByClientId(this.route.snapshot.params["clientId"], 'NAO').subscribe(function (result) {
            _this.listBillToPay = result;
            _this.getListBillToPayPayment();
        });
    }
    BillsToPayComponent.prototype.getListBillToPayPayment = function () {
        var _this = this;
        this.listBillToPay.forEach(function (billToPay) {
            if (billToPay.listBillToPayPayment !== null && billToPay.listBillToPayPayment.length > 0) {
                billToPay.listBillToPayPayment.forEach(function (billToPayPayment) {
                    billToPayPayment.description = billToPay.description;
                    billToPayPayment.isChecked = false;
                    _this.listBillToPayPayment.push(billToPayPayment);
                });
            }
        });
    };
    BillsToPayComponent.prototype.payBills = function () {
        var _this = this;
        this.isPaymentSelected = true;
        this.listBillToPayPayment.forEach(function (billToPayPayment) {
            if (billToPayPayment.isChecked) {
                billToPayPayment.subTotal = billToPayPayment.amountPaid + billToPayPayment.interest;
                _this.totalPayment += billToPayPayment.subTotal;
                _this.listSelectedBillToPayPayment.push(billToPayPayment);
            }
        });
    };
    BillsToPayComponent.prototype.getConvertedDate = function (date) {
        return moment(date).add(1, 'd').format('DD/MM/YYYY');
    };
    BillsToPayComponent.prototype.isDateLessOrEqualThanToday = function (billToPayPayment) {
        if (billToPayPayment.maturity === (moment().subtract(1, 'd').format('YYYY-MM-DD'))) {
            billToPayPayment.isChecked = true;
            return 'IS_SAME';
        }
        if (moment(billToPayPayment.maturity).isBefore(moment().subtract(1, 'd'))) {
            billToPayPayment.isChecked = true;
            return 'IS_BEFORE';
        }
    };
    BillsToPayComponent.prototype.changePaymentMethod = function (method) {
        this.paymentMethod = method;
    };
    return BillsToPayComponent;
}());
BillsToPayComponent = __decorate([
    core_1.Component({
        selector: 'app-bills-to-pay',
        templateUrl: './bills-to-pay.component.html',
        styleUrls: ['./bills-to-pay.component.css']
    })
], BillsToPayComponent);
exports.BillsToPayComponent = BillsToPayComponent;
//# sourceMappingURL=bills-to-pay.component.js.map
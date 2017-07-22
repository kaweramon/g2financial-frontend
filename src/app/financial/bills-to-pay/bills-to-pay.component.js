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
var payment_1 = require("./payment");
var BillsToPayComponent = (function () {
    function BillsToPayComponent(route, service, typeInterestService) {
        var _this = this;
        this.route = route;
        this.service = service;
        this.typeInterestService = typeInterestService;
        this.listBillToPayPayment = [];
        this.listSelectedBillToPayPayment = [];
        this.isPaymentSelected = false;
        this.totalPayment = 0;
        this.maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
        this.maskSecurityCode = [/[0-9]/, /\d/, /\d/];
        this.paymentMethod = '';
        this.payment = new payment_1.Payment();
        this.paymentMethod = 'RECURRENT_CREDIT';
        this.service.listByClientId(this.route.snapshot.params["clientId"], 'NAO').subscribe(function (result) {
            _this.listBillToPay = result;
            _this.getListBillToPayPayment();
        });
        this.typeInterestService.getByType('MENSALIDADE').subscribe(function (result) {
            _this.typeInterestCharge = result;
        });
    }
    BillsToPayComponent.prototype.getListBillToPayPayment = function () {
        var _this = this;
        this.listBillToPay.forEach(function (billToPay) {
            if (billToPay.listBillToPayPayment !== null && billToPay.listBillToPayPayment.length > 0) {
                billToPay.listBillToPayPayment.forEach(function (billToPayPayment) {
                    billToPayPayment.description = billToPay.description;
                    billToPayPayment.isChecked = false;
                    _this.calculateInterests(billToPayPayment);
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
    BillsToPayComponent.prototype.doPayment = function () {
        if (this.paymentMethod === 'CREDIT') {
            this.payment.Type = "CreditCard";
            this.payment.Installments = parseInt(this.payment.Installments.toString());
        }
        else if (this.paymentMethod === 'DEBIT') {
            this.payment.Type = "DebitCard";
        }
        this.payment.Amount = 5;
        this.payment.SoftDescriptor = "TESTE";
        var test = {
            MerchantOrderId: "2014111703",
            Customer: {
                Name: "Teste"
            },
            Payment: this.payment
        };
        this.service.paymentCreditCard(test).subscribe(function (result) {
            console.log(result);
        }, function (error) {
            console.log(error);
        });
    };
    BillsToPayComponent.prototype.calculateInterests = function (billToPayment) {
        billToPayment.amountInterest = (billToPayment.amount / 100) * 1;
        var year = moment(billToPayment.maturity).add(1, 'd').year();
        var month = moment(billToPayment.maturity).add(1, 'd').month();
        var day = moment(billToPayment.maturity).add(1, 'd').date();
        var now = moment();
        var monthInArrears = parseInt(moment([now.year(), now.month(), now.date()]).diff(moment([year, month, day]), 'months', true).toString(), 10);
        var daysInArrears = parseInt(moment().diff(moment(billToPayment.maturity).add(1, 'd'), 'days').toString(), 10);
        billToPayment.daysInArrears = daysInArrears;
        var chargesInDayMonths = [];
        if (daysInArrears !== undefined && daysInArrears > 0) {
            billToPayment.amountInterest = (billToPayment.amount / 100) * this.typeInterestCharge.percentInterest;
            billToPayment.amountCharges = 0.0;
            for (var i = 0; i < daysInArrears; i++) {
                billToPayment.amountCharges += (billToPayment.amount / 100) * this.typeInterestCharge.percentCharges;
                if (monthInArrears !== undefined && monthInArrears > 0 && i > 28 && moment(billToPayment.maturity).add(i + 1, 'd').date() === day) {
                    chargesInDayMonths.push(billToPayment.amountCharges);
                }
            }
            billToPayment.amountLiveDays = 0.0;
            if (chargesInDayMonths.length > 0) {
                billToPayment.amountLiveDays = ((billToPayment.amount / 100) * (this.typeInterestCharge.percentLiveDays * billToPayment.daysInArrears));
            }
            billToPayment.subTotal = billToPayment.amount + billToPayment.amountInterest + billToPayment.amountLiveDays + billToPayment.amountCharges;
        }
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
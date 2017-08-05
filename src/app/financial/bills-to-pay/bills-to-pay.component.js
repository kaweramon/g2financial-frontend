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
var billet_shipping_1 = require("./billet-payment/billet-shipping");
var BillsToPayComponent = (function () {
    function BillsToPayComponent(route, service, typeInterestService, billetShippingService) {
        var _this = this;
        this.route = route;
        this.service = service;
        this.typeInterestService = typeInterestService;
        this.billetShippingService = billetShippingService;
        this.listBillToPayPayment = [];
        this.listSelectedBillToPayPayment = [];
        this.isPaymentSelected = false;
        this.totalPayment = 0;
        this.maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
        this.maskSecurityCode = [/[0-9]/, /\d/, /\d/];
        this.paymentMethod = '';
        this.payment = new payment_1.Payment();
        //TODO: remover
        this.paymentMethod = 'BILLET';
        // this.isPaymentSelected = true;
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
                    _this.isDateLessOrEqualThanToday(billToPayPayment);
                    _this.calculateInterests(billToPayPayment);
                    _this.listBillToPayPayment.push(billToPayPayment);
                });
            }
        });
    };
    BillsToPayComponent.prototype.payBills = function () {
        var _this = this;
        this.isPaymentSelected = true;
        this.listSelectedBillToPayPayment = [];
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
        billToPayPayment.isChecked = false;
        if (billToPayPayment.maturity === (moment().subtract(1, 'd').format('YYYY-MM-DD'))) {
            billToPayPayment.isChecked = true;
            billToPayPayment.dateStatus = 'IS_SAME';
        }
        if (moment(billToPayPayment.maturity).isBefore(moment().subtract(1, 'd'))) {
            billToPayPayment.isChecked = true;
            billToPayPayment.dateStatus = 'IS_BEFORE';
        }
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
        else {
            billToPayment.subTotal = billToPayment.amount;
        }
    };
    BillsToPayComponent.prototype.generateBillet = function () {
        var _this = this;
        var billetShipping = new billet_shipping_1.BilletShipping();
        var ourNumber = "";
        this.billetShippingService.getLastCounter().subscribe(function (result) {
            var nextCounter = result + 1;
            billetShipping.counter = nextCounter;
            console.log((12 - nextCounter.toString().length));
            for (var i = 0; i < (12 - nextCounter.toString().length); i++) {
                ourNumber += "0";
            }
            ourNumber += nextCounter.toString();
            console.log(ourNumber);
            //Calculo do digito Santander
            var ourNumberArrayInverted = ourNumber.split("").reverse().join("");
            var total = 0;
            console.log("inverted: " + ourNumberArrayInverted);
            for (var j = 0; j < ourNumberArrayInverted.length; j++) {
                if (j < 8) {
                    total += (parseInt(ourNumberArrayInverted[j]) * (j + 2));
                }
                else if (j === 8) {
                    total += (parseInt(ourNumberArrayInverted[j]) * 2);
                }
                else if (j === 9) {
                    total += (parseInt(ourNumberArrayInverted[j]) * 3);
                }
                else if (j === 10) {
                    total += (parseInt(ourNumberArrayInverted[j]) * 4);
                }
                else if (j === 11) {
                    total += (parseInt(ourNumberArrayInverted[j]) * 5);
                }
            }
            var rest = (total / 11).toString().split(".")[1].split("")[0];
            var digit = 11 - parseInt(rest);
            ourNumber += "-" + digit;
            console.log(ourNumber);
            billetShipping.ourNumber = ourNumber;
            billetShipping.billValue = _this.totalPayment;
            billetShipping.clientId = _this.route.snapshot.params["clientId"];
            billetShipping.isCancel = false;
            var paymentTypes = "";
            for (var i = 0; i < _this.listSelectedBillToPayPayment.length; i++) {
                if (i < _this.listSelectedBillToPayPayment.length - 1) {
                    paymentTypes += _this.listSelectedBillToPayPayment[i].description + ", ";
                }
                else {
                    paymentTypes += _this.listSelectedBillToPayPayment[i].description;
                }
            }
            billetShipping.chargingType = paymentTypes;
            billetShipping.partialPayment = "NAO";
            _this.billetShippingService.create(billetShipping).subscribe(function (result) {
                console.log(result);
            }, function (error) {
                console.log(error);
            });
        }, function (error) {
            console.log(error);
        });
    };
    BillsToPayComponent.prototype.printBillet = function () {
        // tablebillet
        var printContents, popupWin;
        printContents = document.getElementById('tablebillet').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write("\n      <html>\n        <head>\n          <style>\n          .logo{\n  text-align: center; height: 10mm; border-right: 1mm solid #000000; border-bottom: 1mm solid #000000\n}\n.logo{\n  text-align: center; height: 10mm; border-right: 1mm solid #000000; border-bottom: 1mm solid #000000\n}\n.bankCode {\n  font-size: 5mm; font-family: arial, verdana; font-weight : bold;\n  font-style: italic; text-align: center; vertical-align: bottom;\n  padding-right: 1mm; border-right: 1mm solid #000000; border-bottom: 1mm solid #000000\n}\n.bankCode2 {\n  font-size: 5mm; font-family: arial, verdana; font-weight : bold;\n  font-style: italic; text-align: center; vertical-align: bottom;\n  /*border-bottom: 1.2mm solid #000000; border-right: 1.2mm solid #000000;*/\n}\n.billetNumber {\n  font-size: 5mm; font-family: arial, verdana; font-weight : bold;\n  text-align: center; vertical-align: bottom; padding-bottom : 1mm;\n}\n.billetRightHeader {\n  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm; border-bottom: 1mm solid #000000\n}\n.billetRightHeader2 {\n  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;\n}\n.billetRightField {\n  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm; border-left: 0.15mm solid #000000;\n}\n.billetLeftField2 {\n  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm; border-left: 0.15mm solid #000000;\n}\n.billetLeftField {\n  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;\n}\n.billetLeftValue {\n  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;\n}\n.billetLeftValue2 {\n  font-size: 3mm; font-family: arial, verdana; padding-left : 1mm;\n  text-align: center; font-weight: bold; border-left: 0.15mm solid #000000;\n  border-bottom: 0.15mm solid #000000;\n}\n.billetRightTextValue {\n  font-size: 3mm; font-family: arial, verdana; text-align:right;\n  padding-right: 1mm; font-weight: bold; border-left: 0.15mm solid #000000;\n  border-bottom: 0.15mm solid #000000;\n}\n.tr-border-bottom {\n  border-bottom: 0.15mm solid #000000;\n}\n\n</style>\n          <title>Comprovante</title>\n        </head>\n    <body onload=\"window.print();window.close()\">" + printContents + "</body>\n      </html>");
        popupWin.document.close();
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
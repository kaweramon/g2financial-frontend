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
    function BillsToPayComponent(route, service, elementRef, typeInterestService, billetShippingService, bankService) {
        var _this = this;
        this.route = route;
        this.service = service;
        this.elementRef = elementRef;
        this.typeInterestService = typeInterestService;
        this.billetShippingService = billetShippingService;
        this.bankService = bankService;
        this.listBillToPayPayment = [];
        this.listSelectedBillToPayPayment = [];
        this.isPaymentSelected = false;
        this.totalPayment = 0;
        this.maskValidDate = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
        this.maskSecurityCode = [/[0-9]/, /\d/, /\d/];
        this.paymentMethod = '';
        this.ourNumber = "";
        this.codeBar = "";
        this.payment = new payment_1.Payment();
        //TODO: remover
        this.paymentMethod = 'BILLET';
        // this.isPaymentSelected = true;
        this.bankService.getByBankNamRem("SANTANDER").subscribe(function (result) {
            _this.service.listByClientId(_this.route.snapshot.params["clientId"], 'NAO', result.id).subscribe(function (result) {
                _this.listBillToPay = result;
                _this.getListBillToPayPayment();
            });
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
        this.isPaymentSelected = true;
        this.listSelectedBillToPayPayment = [];
        for (var i = 0; i < this.listBillToPayPayment.length; i++) {
            var billToPayPayment = this.listBillToPayPayment[i];
            if (billToPayPayment.isChecked) {
                this.totalPayment += billToPayPayment.subTotal;
                this.listSelectedBillToPayPayment.push(billToPayPayment);
            }
            if (i == this.listBillToPayPayment.length - 1) {
                // this.generateCodeBar();
            }
        }
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
    BillsToPayComponent.prototype.generateBillet = function (billToPayPaymentSelectedId) {
        var _this = this;
        this.billetShippingService.getByCounter(billToPayPaymentSelectedId).subscribe(function (result) {
            _this.billetShipping = result;
            var ourNumberArray = _this.billetShipping.ourNumber.split("");
            for (var i = 0; i < ourNumberArray.length; i++) {
                if (_this.billetShipping.ourNumber.charAt(i) !== "0") {
                    _this.billetShipping.documentNumber = _this.billetShipping.ourNumber.substr(i, (_this.billetShipping.ourNumber.length - 2));
                    break;
                }
            }
            _this.billetShippingService.getLastCounter().subscribe(function (result) {
                var nextCounter = result + 1;
                _this.billetShipping.counter = nextCounter;
                for (var i = 0; i < (12 - nextCounter.toString().length); i++) {
                    _this.ourNumber += "0";
                }
                _this.ourNumber += nextCounter.toString();
                //Calculo do digito Santander
                var ourNumberArrayInverted = _this.ourNumber.split("").reverse().join("");
                var total = 0;
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
                var rest = "0";
                if ((total / 11).toString().indexOf(".") !== -1) {
                    rest = (total / 11).toString().split(".")[1].split("")[0];
                }
                var digit = 11 - parseInt(rest);
                // this.ourNumber += "-" + digit;
                _this.billetShipping.ourNumber += "-" + digit;
                // this.billetShipping.billValue = this.totalPayment;
                _this.billetShipping.clientId = _this.route.snapshot.params["clientId"];
                // this.billetShipping.isCancel = false;
                var paymentTypes = "";
                for (var i = 0; i < _this.listSelectedBillToPayPayment.length; i++) {
                    if (i < _this.listSelectedBillToPayPayment.length - 1) {
                        paymentTypes += _this.listSelectedBillToPayPayment[i].description + ", ";
                    }
                    else {
                        paymentTypes += _this.listSelectedBillToPayPayment[i].description;
                    }
                }
                _this.billetShipping.chargingType = paymentTypes;
                _this.billetShipping.documentNumber = _this.ourNumber.substring(_this.ourNumber.length - 7, _this.ourNumber.length - 2);
                _this.generateCodeBar(_this.generateQrBarCode());
                setTimeout(function () {
                    // this.printBillet();
                }, 2000);
            }, function (error) {
                console.log(error);
            });
        });
        /*$('#btnGenerateBillet').prop('disabled', true);
        */
    };
    BillsToPayComponent.prototype.generateCodeBar = function (callback) {
        // Primeiro Grupo
        var codeBarFirstGroup = "033998548";
        var codeBarFirstGroupInverted = codeBarFirstGroup.split("").reverse().join("");
        var total = 0;
        for (var i = 0; i < codeBarFirstGroupInverted.length; i++) {
            var currentNumber = parseInt(codeBarFirstGroupInverted[i]);
            if (i == 4 && currentNumber == 9) {
                total += currentNumber;
            }
            else {
                if (i % 2 == 0) {
                    if (currentNumber * 2 > 9) {
                        var firstDigit = parseInt((currentNumber * 2).toString().split("")[0].toString());
                        var secondDigit = parseInt((currentNumber * 2).toString().split("")[1].toString());
                        total += (firstDigit + secondDigit);
                    }
                    else {
                        total += currentNumber * 2;
                    }
                }
                else {
                    total += currentNumber;
                }
            }
        }
        var digitRest = parseInt((total / 10).toString().split(".")[1]);
        codeBarFirstGroup += (10 - digitRest);
        console.log("primeiro grupo: " + codeBarFirstGroup);
        // Segundo Grupo
        var codeBarSecondGroup = "862" + this.ourNumber.substr(0, 7);
        var codeBarSecondGroupInverted = codeBarSecondGroup.split("").reverse().join("");
        var totalSecondGroup = 0;
        console.log(codeBarSecondGroupInverted);
        for (var j = 0; j < codeBarSecondGroupInverted.length; j++) {
            var currentNumber = parseInt(codeBarSecondGroupInverted[j]);
            if (j == 0 || j % 2 == 0) {
                if ((currentNumber * 2) > 9) {
                    var firstDigit = parseInt((currentNumber * 2).toString().split("")[0].toString());
                    var secondDigit = parseInt((currentNumber * 2).toString().split("")[1].toString());
                    totalSecondGroup += (firstDigit + secondDigit);
                }
                else {
                    totalSecondGroup += (currentNumber * 2);
                }
            }
            else {
                totalSecondGroup += currentNumber;
            }
        }
        var digitRestSecondGroup = parseInt((totalSecondGroup / 10).toString().split(".")[1]);
        codeBarSecondGroup += (10 - digitRestSecondGroup);
        console.log("segundo grupo: " + codeBarSecondGroup);
        //Terceiro Grupo
        //5 7 8 0 0 0 0 1 0 2
        /*let codeBarThirdGroup = this.ourNumber.substr(6, this.ourNumber.length - 1);
        codeBarThirdGroup = codeBarThirdGroup.replace(/-/g, "");
        codeBarThirdGroup += "0101";*/
        var codeBarThirdGroup = "5780000102";
        var codeBarThirdGroupInverted = codeBarThirdGroup.split("").reverse().join("");
        var totalThirdGroup = 0;
        for (var k = 0; k < codeBarThirdGroupInverted.length; k++) {
            var currentNumberThirdGroup = parseInt(codeBarThirdGroupInverted[k]);
            if (k == 0 || k % 2 == 0) {
                if ((currentNumberThirdGroup * 2) > 9) {
                    var firstDigit = parseInt((currentNumberThirdGroup * 2).toString().split("")[0].toString());
                    var secondDigit = parseInt((currentNumberThirdGroup * 2).toString().split("")[1].toString());
                    totalThirdGroup += (firstDigit + secondDigit);
                    console.log(firstDigit, secondDigit);
                }
                else {
                    totalThirdGroup += (currentNumberThirdGroup * 2);
                }
            }
            else {
                totalThirdGroup += currentNumberThirdGroup;
            }
        }
        console.log("total terceiro grupo: " + totalThirdGroup);
        var restDigitThirdGroup = (totalThirdGroup / 10).toString().split(".")[1] !== undefined ?
            parseInt((totalThirdGroup / 10).toString().split(".")[1]) : 0;
        restDigitThirdGroup = restDigitThirdGroup !== NaN ? restDigitThirdGroup : 0;
        codeBarThirdGroup += (10 - restDigitThirdGroup);
        // Quarto Grupo - Digito Verificador
        var factorMaturity = moment().diff(moment("1997-10-07"), 'days');
        // Numero PSK (Codigo G2) = 8548862
        // calcular valor nominal (10 digitos)
        var valueStr = (this.totalPayment.toFixed(2)).replace(/([.*+?^$|(){}\[\]-])/mg, "");
        var nominalValue = "";
        for (var y = 0; y < (10 - valueStr.length); y++) {
            nominalValue += "0";
        }
        nominalValue += valueStr;
        var verifyDigitStr = "0339" + factorMaturity + nominalValue + "9" +
            "8548862" + this.ourNumber + "0" + "101";
        verifyDigitStr = verifyDigitStr.replace(/([.*+?^$|(){}\[\]-])/mg, "");
        var verifyDigitStrInverted = verifyDigitStr.split("").reverse().join("");
        var totalFourthGroup = 0;
        var numberToCalc = 2;
        for (var p = 0; p < verifyDigitStrInverted.length; p++) {
            totalFourthGroup += parseInt(verifyDigitStrInverted[p]) * numberToCalc;
            numberToCalc++;
            if (p == 7 || p == 15 || p == 23 || p == 31 || p == 39) {
                numberToCalc = 2;
            }
        }
        var verifyDigit = ((totalFourthGroup * 10) / 11).toString().split(".")[1];
        var numberVerifyDigit = 0;
        if (verifyDigit !== undefined) {
            if (verifyDigit.split("").length > 1) {
                if (parseInt(verifyDigit.split("")[1]) > 5) {
                    numberVerifyDigit = parseInt(verifyDigit.split("")[0]) + 1;
                }
                else {
                    numberVerifyDigit = parseInt(verifyDigit.split("")[0]);
                }
            }
            else {
                numberVerifyDigit = parseInt(verifyDigit.split("")[0]);
            }
        }
        // Quinto Grupo -> Fator de Vencimento e Valor Nominal
        var codeBarFifthGroup = factorMaturity + nominalValue;
        this.billetShipping.codeBar = codeBarFirstGroup + " " + codeBarSecondGroup + " " + codeBarThirdGroup + " " + numberVerifyDigit + " " + codeBarFifthGroup;
        //Inserir pontos
        this.billetShipping.codeBar = this.insertStr(this.billetShipping.codeBar, [5, 17, 30], ".");
        console.log("Código de Barras: " + this.billetShipping.codeBar);
        //15
        setTimeout(function () {
            if (callback) {
                callback();
            }
        }, 2000);
    };
    BillsToPayComponent.prototype.insertStr = function (str, indexes, value) {
        for (var i = 0; i < indexes.length; i++) {
            str = str.substr(0, indexes[i]) + value + str.substr(indexes[i]);
        }
        console.log(str);
        return str;
    };
    BillsToPayComponent.prototype.generateQrBarCode = function () {
        // setTimeout(() => {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "src/app/financial/bills-to-pay/billet-payment/billet-barcode.js";
        this.elementRef.nativeElement.appendChild(s);
        // }, 5000);
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
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
var $ = require("jquery");
var client_1 = require("../../search-client/client");
var BillsToPayComponent = (function () {
    function BillsToPayComponent(route, service, elementRef, typeInterestService, clientService) {
        var _this = this;
        this.route = route;
        this.service = service;
        this.elementRef = elementRef;
        this.typeInterestService = typeInterestService;
        this.clientService = clientService;
        this.listBillToPayPayment = [];
        this.listSelectedBillToPayPayment = [];
        this.isPaymentSelected = false;
        this.totalPayment = 0;
        this.paymentMethod = '';
        this.ourNumber = "";
        this.codeBar = "";
        this.billetGenerated = false;
        this.client = new client_1.Client();
        this.payment = new payment_1.Payment();
        //TODO: remover
        this.paymentMethod = 'BILLET';
        this.clientService.view(this.route.snapshot.params["clientId"]).subscribe(function (client) {
            _this.client = client;
        });
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
        this.isPaymentSelected = true;
        this.listSelectedBillToPayPayment = [];
        for (var i = 0; i < this.listBillToPayPayment.length; i++) {
            var billToPayPayment = this.listBillToPayPayment[i];
            if (billToPayPayment.isChecked) {
                this.totalPayment += billToPayPayment.subTotal;
                this.listSelectedBillToPayPayment.push(billToPayPayment);
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
    BillsToPayComponent.prototype.generateBillet = function (billetShipping) {
        var _this = this;
        $('#btnGenerateBillet').prop('disabled', true);
        this.billetShipping = billetShipping;
        this.billetShipping.clientId = this.route.snapshot.params["clientId"];
        this.billetShipping.isCancel = false;
        var paymentTypes = "";
        for (var i = 0; i < this.listSelectedBillToPayPayment.length; i++) {
            if (i < this.listSelectedBillToPayPayment.length - 1) {
                paymentTypes += this.listSelectedBillToPayPayment[i].description + ", ";
            }
            else {
                paymentTypes += this.listSelectedBillToPayPayment[i].description;
            }
        }
        this.billetShipping.chargingType = paymentTypes;
        this.billetShipping.partialPayment = "NAO";
        this.billetShipping.documentNumber = this.ourNumber.substring(this.ourNumber.length - 7, this.ourNumber.length - 2);
        this.billetGenerated = true;
        this.generateCodeBarCaixa();
        setTimeout(function () {
            _this.billetGenerated = true;
            _this.generateQrBarCode();
            // this.printBillet();
        }, 500);
    };
    BillsToPayComponent.prototype.generateCodeBarCaixa = function () {
        // Posição 1-3 -> Identificação do banco (104)
        // Posição 4 -> Código da moeda (9 - Real)
        // TODO: Posição 5 -> DV Geral do Código de Barras
        var codeBarToReturn = "";
        // Posição 06 - 09 -> Fator de Vencimento
        var maturityFactor = this.getMaturityFactor(this.billetShipping.maturityDate);
        var billetValueCalculated = this.getBilletCodeBarValue(this.billetShipping.billValue).toString();
        // 20 – 25 6 9 (6) Código do Beneficiário
        var benefictCode = "377192";
        // 26 – 26 1 9 (1) DV do Código do Beneficiário
        var dvBenefictCode = this.getVerifyDigitBeneficiaryCode(benefictCode);
        // 27 – 29 3 9 (3) Nosso Número - Seqüência 1
        codeBarToReturn += this.billetShipping.ourNumber.substring(0, 2);
        // 30 – 30 1 9 (1) Constante 1
        codeBarToReturn += "1";
        // 31 – 33 3 9 (3) Nosso Número - Seqüência 2
        codeBarToReturn += this.billetShipping.ourNumber.substring(3, 5);
        // 34 – 34 1 9 (1) Constante 2
        codeBarToReturn += "4";
        // 35 – 43 9 9 (9) Nosso Número - Seqüência 3
        codeBarToReturn += this.billetShipping.ourNumber.substring(6, this.billetShipping.ourNumber.length - 1);
        // 44 – 44 1 9 (1) DV do Campo Livre
        // Código do beneficiário -> 377192
        var dvFreeCamp = this.getFreeCampCodeBar("377192", dvBenefictCode.toString(), this.billetShipping.ourNumber);
        var generalVerifyDigit = this.getVerifyDigitGeneral(maturityFactor, billetValueCalculated, benefictCode, dvBenefictCode.toString(), this.billetShipping.ourNumber, dvFreeCamp);
        var field1 = "1049" + benefictCode.charAt(0) + "." + benefictCode.substring(1, 5) +
            this.getVerifyDigitFields123("1049" + benefictCode.charAt(0) + benefictCode.substring(1, 5));
        var field2 = benefictCode.charAt(benefictCode.length - 1) + dvBenefictCode + this.billetShipping.ourNumber.substring(0, 3)
            + ".1" + this.billetShipping.ourNumber.substring(3, 6) + "4" +
            this.getVerifyDigitFields123(benefictCode.charAt(benefictCode.length - 1) + dvBenefictCode +
                this.billetShipping.ourNumber.substring(0, 3) + "1" + this.billetShipping.ourNumber.substring(3, 6) + "4");
        var field3 = this.billetShipping.ourNumber.substring(6, 11) + "." +
            this.billetShipping.ourNumber.substring(11, this.billetShipping.ourNumber.length) + dvFreeCamp +
            this.getVerifyDigitFields123(this.billetShipping.ourNumber.substring(6, 11) +
                this.billetShipping.ourNumber.substring(11, this.billetShipping.ourNumber.length) + dvFreeCamp);
        codeBarToReturn = field1 + " " + field2 + " " + field3 + " " + generalVerifyDigit + " " + maturityFactor + billetValueCalculated;
        this.billetShipping.ourNumber = "14" + this.billetShipping.ourNumber + "-" +
            this.getVerifyDigitOurNumber("14" + this.billetShipping.ourNumber);
        this.codeBar = codeBarToReturn;
    };
    // CÁLCULO DO DÍGITO VERIFICADOR DA LINHA DIGITÁVEL (CAMPOS 1, 2 E 3)
    BillsToPayComponent.prototype.getVerifyDigitFields123 = function (strToCalc) {
        var toReturn;
        var total = 0;
        strToCalc = strToCalc.split("").reverse().join("");
        for (var i = 0; i < strToCalc.length; i++) {
            if (i % 2 == 0 || i == 0) {
                if ((parseInt(strToCalc[i]) * 2).toString().split("").length == 2) {
                    var alg1 = parseInt((parseInt(strToCalc[i]) * 2).toString().split("")[0]);
                    var alg2 = parseInt((parseInt(strToCalc[i]) * 2).toString().split("")[1]);
                    total += (alg1 + alg2);
                }
                else {
                    total += parseInt(strToCalc[i]) * 2;
                }
            }
            else {
                total += parseInt(strToCalc[i]);
            }
        }
        if (total < 10) {
            toReturn = 10 - total;
        }
        var restAux = (total / 10).toString().split(".");
        var rest = parseInt(restAux[1].split("")[restAux[1].split("").length - 1]);
        if (rest == 0) {
            toReturn = 0;
        }
        else {
            toReturn = 10 - rest;
        }
        return toReturn;
    };
    //  CALCULO DO DÍGITO VERIFICADOR GERAL DO CÓDIGO DE BARRAS
    BillsToPayComponent.prototype.getVerifyDigitGeneral = function (maturityFactor, billetValue, benefictCode, dvBenefictCode, ourNumber, dvFreeCamp) {
        var toReturn;
        var calcStrArray = ("1049" + maturityFactor + billetValue + benefictCode + dvBenefictCode + ourNumber.substring(0, 3)
            + "1" + ourNumber.substring(3, 6) + "4" + ourNumber.substring(6, ourNumber.length) + dvFreeCamp).split("");
        var total = 0;
        for (var i = 0; i < calcStrArray.length; i++) {
            if (i == 0 || i == 8 || i == 16 || i == 24 || i == 32 || i == 40) {
                total += parseInt(calcStrArray[i]) * 4;
            }
            if (i == 1 || i == 9 || i == 17 || i == 25 || i == 33 || i == 41) {
                total += parseInt(calcStrArray[i]) * 3;
            }
            if (i == 2 || i == 10 || i == 18 || i == 26 || i == 34 || i == 42) {
                total += parseInt(calcStrArray[i]) * 2;
            }
            if (i == 3 || i == 11 || i == 19 || i == 27 || i == 35 || i == 43) {
                total += parseInt(calcStrArray[i]) * 9;
            }
            if (i == 4 || i == 12 || i == 20 || i == 28 || i == 36) {
                total += parseInt(calcStrArray[i]) * 8;
            }
            if (i == 5 || i == 13 || i == 21 || i == 29 || i == 37) {
                total += parseInt(calcStrArray[i]) * 7;
            }
            if (i == 6 || i == 14 || i == 22 || i == 30 || i == 38) {
                total += parseInt(calcStrArray[i]) * 6;
            }
            if (i == 7 || i == 15 || i == 23 || i == 31 || i == 39) {
                total += parseInt(calcStrArray[i]) * 5;
            }
        }
        var restAux = (total / 11).toString().split(".");
        var rest;
        if (restAux[1] === undefined) {
            toReturn = 1;
        }
        else {
            rest = (parseInt(restAux[1].split("")[0]) + 1);
        }
        if (rest !== undefined) {
            if ((11 - rest) > 9) {
                toReturn = 1;
            }
            else {
                toReturn = 11 - rest;
            }
        }
        return toReturn;
    };
    // Cálculo do fator de vencimento Posição: 06-09 - CAIXA
    BillsToPayComponent.prototype.getMaturityFactor = function (date) {
        return moment(date).diff(moment("1997-10-07"), 'days');
    };
    // Cálculo do digito verificador do código do beneficiário - CAIXA
    BillsToPayComponent.prototype.getVerifyDigitBeneficiaryCode = function (beneficiaryCode) {
        var toReturn;
        var beneficiaryCodeInverted = beneficiaryCode.split("").reverse().join("");
        var total = 0;
        for (var i = 0; i < beneficiaryCodeInverted.length; i++) {
            total += (parseInt(beneficiaryCodeInverted[i]) * (i + 2));
        }
        var rest = 0;
        if (total >= 11) {
            var restAux = (total / 11).toString().split(".");
            rest = parseInt(restAux[1].split("")[restAux[1].split("").length - 1]);
            toReturn = (11 - rest);
        }
        else {
            toReturn = (11 - total);
        }
        if (toReturn > 9) {
            return 0;
        }
        return toReturn;
    };
    // CAMPO LIVRE DO CÓDIGO DE BARRAS
    BillsToPayComponent.prototype.getFreeCampCodeBar = function (beneficCode, dvBenefictCode, ourNumber) {
        var result;
        var strCalcFreeCamp = beneficCode + dvBenefictCode + ourNumber.substring(0, 3) + "1" + ourNumber.substring(3, 6) + "4" +
            ourNumber.substring(6, ourNumber.length);
        var strInverted = strCalcFreeCamp.split("").reverse().join("");
        var multiplicationIndex = 2;
        var total = 0;
        for (var i = 0; i < strInverted.length; i++) {
            if (i == 8 || i == 16) {
                multiplicationIndex = 2;
            }
            total += (parseInt(strInverted[i])) * multiplicationIndex;
            multiplicationIndex++;
        }
        if (total < 11) {
            result = total - 11;
        }
        else {
            var divisionResult = (total / 11).toString().split(".");
            var rest = void 0;
            if (divisionResult[1] !== undefined) {
                if (divisionResult[1].split("").length > 1) {
                    rest = parseInt(divisionResult[1].split("")[0]) + 1;
                }
                else {
                    rest = (parseInt(divisionResult[1].split("")[0]));
                }
            }
            else {
                rest = 0;
            }
            result = 11 - rest;
        }
        return result;
    };
    // Cálculo do valor (Posição: 10-19) - CAIXA
    BillsToPayComponent.prototype.getBilletCodeBarValue = function (billValue) {
        var toReturn = "";
        var cleanValueStr = "";
        if (billValue.toString().indexOf(".") == -1 && billValue.toString().indexOf(",") == -1) {
            for (var i = 0; i < (8 - billValue.toString().length); i++) {
                toReturn += "0";
            }
            toReturn += billValue;
            toReturn += "00";
        }
        else {
            cleanValueStr = billValue.toString().replace(".", "").replace(",", "");
            for (var i = 0; i < (10 - cleanValueStr.length); i++) {
                toReturn += "0";
            }
            toReturn += cleanValueStr;
        }
        return toReturn;
    };
    BillsToPayComponent.prototype.getVerifyDigitOurNumber = function (ourNumber) {
        var toReturn;
        var ourNumberInverted = ourNumber.split("").reverse().join("");
        var total = 0;
        var multiplicationIndex = 2;
        for (var i = 0; i < ourNumberInverted.length; i++) {
            if (i == 8 || i == 16) {
                multiplicationIndex = 2;
            }
            total += parseInt(ourNumberInverted[i]) * multiplicationIndex;
            multiplicationIndex++;
        }
        var rest;
        var restAux = (total / 11).toString().split(".");
        rest = ((parseInt(restAux[1].split("").pop())) + 1);
        if ((11 - rest) > 9) {
            toReturn = 0;
        }
        else {
            toReturn = 11 - rest;
        }
        return toReturn;
    };
    BillsToPayComponent.prototype.generateCodeBar = function () {
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
                    if (currentNumber * 2 > 10) {
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
        codeBarFirstGroup += "." + (10 - digitRest);
        // Segundo Grupo
        var codeBarSecondGroup = "862" + this.ourNumber.substr(0, 7);
        var codeBarSecondGroupInverted = codeBarSecondGroup.split("").reverse().join("");
        var totalSecondGroup = 0;
        for (var j = 0; j < codeBarSecondGroupInverted.length; j++) {
            var currentNumber = parseInt(codeBarSecondGroupInverted[j]);
            if (j % 2 == 0) {
                totalSecondGroup += currentNumber * 2;
            }
            else {
                totalSecondGroup += currentNumber;
            }
        }
        var digitRestSecondGroup = parseInt((totalSecondGroup / 10).toString().split(".")[1]);
        codeBarSecondGroup += "." + (10 - digitRestSecondGroup);
        //Terceiro Grupo
        var codeBarThirdGroup = this.ourNumber.substr(7, 14);
        codeBarThirdGroup = codeBarThirdGroup.replace(/-/g, "");
        codeBarThirdGroup += "0101";
        var codeBarThirdGroupInverted = codeBarThirdGroup.split("").reverse().join("");
        var totalThirdGroup = 0;
        for (var k = 0; k < codeBarThirdGroupInverted.length; k++) {
            var currentNumberThirdGroup = parseInt(codeBarThirdGroupInverted[k]);
            if (k % 2 == 0) {
                totalThirdGroup += currentNumberThirdGroup * 2;
            }
            else {
                totalThirdGroup += currentNumberThirdGroup;
            }
        }
        var restDigitThirdGroup = (totalThirdGroup / 10).toString().split(".")[1] !== undefined ?
            parseInt((totalThirdGroup / 10).toString().split(".")[1]) : 0;
        restDigitThirdGroup = restDigitThirdGroup !== NaN ? restDigitThirdGroup : 0;
        codeBarThirdGroup += "." + (10 - restDigitThirdGroup);
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
        this.codeBar = codeBarFirstGroup + " " + codeBarSecondGroup + " " + codeBarThirdGroup + " " + numberVerifyDigit + " " + codeBarFifthGroup;
        console.log("Código de Barras: " + this.codeBar);
        console.log(this.getMaturityFactor('2006-08-23'));
        console.log(this.getBilletCodeBarValue(this.totalPayment));
        console.log("dig cod. beneficiário: " + this.getVerifyDigitBeneficiaryCode("005507"));
        //Código do beneficiário: 45000
        //DV do Código do Beneficiário = 0
    };
    BillsToPayComponent.prototype.generateQrBarCode = function () {
        var _this = this;
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "src/app/financial/bills-to-pay/billet-payment/billet-barcode.js";
        this.elementRef.nativeElement.appendChild(s);
        setTimeout(function () {
            _this.printBillet();
        }, 2000);
    };
    BillsToPayComponent.prototype.printBillet = function () {
        // tablebillet
        var printContents, popupWin;
        printContents = document.getElementById('tablebillet').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write("\n      <html>\n        <head>\n          <style>\n          .logo{\n  text-align: center; height: 10mm; border-right: 1mm solid #000000; border-bottom: 1mm solid #000000\n}\n.img-logo {\n  content: url('../../../assets/images/logo_caixa.png');\n}\n.bankCode {\n  font-size: 5mm; font-family: arial, verdana; font-weight : bold;\n  font-style: italic; text-align: center; vertical-align: bottom;\n  padding-right: 1mm; border-right: 1mm solid #000000; border-bottom: 1mm solid #000000\n}\n.bankCode2 {\n  font-size: 5mm; font-family: arial, verdana; font-weight : bold;\n  font-style: italic; text-align: center; vertical-align: bottom;\n  /*border-bottom: 1.2mm solid #000000; border-right: 1.2mm solid #000000;*/\n}\n.billetNumber {\n  font-size: 3.2mm; font-family: arial, verdana; font-weight : bold;\n  text-align: center; vertical-align: bottom; padding-bottom : 1mm;\n  border-bottom: 1mm solid #000000;\n}\n.billetRightHeader {\n  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;\n  border-bottom: 1mm solid #000000; font-weight : bold;\n}\n.billetRightHeader2 {\n  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;\n}\n.billetRightField {\n  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;\n  border-left: 0.15mm solid #000000;\n}\n.billetRightFieldBorderNone {\n  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;\n}\n.billetLeftField2 {\n  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm; border-left: 0.15mm solid #000000;\n}\n.billetLeftField {\n  font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;\n}\n.billetLeftValue {\n  font-size: 0.29cm; font-family: arial, verdana; padding-left : 1mm;\n  border-left: 0.15mm solid #000000; border-bottom: 0.15mm solid #000000;\n  font-weight: bold;\n}\n.billetLeftValueBorderNone {\n  font-size: 0.29cm; font-family: arial, verdana; padding-left : 1mm;\n  font-weight: bold;\n}\n.billetLeftValue2 {\n  font-size: 3mm; font-family: arial, verdana; padding-left : 1mm;\n  text-align: center; font-weight: bold; border-left: 0.15mm solid #000000;\n  border-bottom: 0.15mm solid #000000;\n}\n.billetLeftValue3 {\n  font-size: 0.29cm; font-family: arial, verdana; padding-left : 1mm;\n  text-align: left; font-weight: bold; border-left: 0.15mm solid #000000;\n}\n.billetRightTextValue {\n  font-size: 0.29cm; font-family: arial, verdana; text-align:right;\n  padding-right: 1mm; font-weight: bold; border-left: 0.15mm solid #000000; border-bottom: 0.15mm solid #000000;\n}\n.billetLeftTextValue2 {\n  font-size: 0.29cm; font-family: arial, verdana;\n  padding-left: 1mm; font-weight: bold; border-left: 0.15mm solid #000000;\n}\n.tr-border-bottom {\n  border-bottom: 0.15mm solid #000000;\n}\n</style>\n          <title>Comprovante</title>\n        </head>\n    <body onload=\"window.print();window.close()\">" + printContents + "</body>\n      </html>");
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
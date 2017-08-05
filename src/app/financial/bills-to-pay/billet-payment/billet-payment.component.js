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
var BilletPaymentComponent = (function () {
    function BilletPaymentComponent(elementRef) {
        this.elementRef = elementRef;
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "src/app/financial/bills-to-pay/billet-payment/billet-barcode.js";
        this.elementRef.nativeElement.appendChild(s);
    }
    BilletPaymentComponent.prototype.getMaturityDate = function () {
        return moment().format('DD/MM/YYYY');
    };
    return BilletPaymentComponent;
}());
__decorate([
    core_1.Input()
], BilletPaymentComponent.prototype, "totalPayment", void 0);
BilletPaymentComponent = __decorate([
    core_1.Component({
        selector: 'app-billet-payment',
        templateUrl: './billet-payment.component.html',
        styleUrls: ['./billet-payment.component.css']
    })
], BilletPaymentComponent);
exports.BilletPaymentComponent = BilletPaymentComponent;
//# sourceMappingURL=billet-payment.component.js.map
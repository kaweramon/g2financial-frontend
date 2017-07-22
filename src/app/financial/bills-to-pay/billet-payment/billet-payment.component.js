"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var BilletPaymentComponent = (function () {
    function BilletPaymentComponent(fb) {
        this.fb = fb;
        this.formBuilder = fb;
    }
    BilletPaymentComponent.prototype.initFormBuilder = function () {
        this.formBilletPayment = this.formBuilder.group({
            'street': [this.address.Street, [forms_1.Validators.required]],
            'number': [this.address.Number, [forms_1.Validators.required]]
        });
    };
    return BilletPaymentComponent;
}());
BilletPaymentComponent = __decorate([
    core_1.Component({
        selector: 'app-billet-payment',
        templateUrl: './billet-payment.component.html',
        styleUrls: ['./billet-payment.component.css']
    })
], BilletPaymentComponent);
exports.BilletPaymentComponent = BilletPaymentComponent;
//# sourceMappingURL=billet-payment.component.js.map
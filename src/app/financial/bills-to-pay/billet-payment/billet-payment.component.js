"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var BilletPaymentComponent = (function () {
    function BilletPaymentComponent(elementRef, route, billetService, clientService) {
        var _this = this;
        this.elementRef = elementRef;
        this.route = route;
        this.billetService = billetService;
        this.clientService = clientService;
        this.codeBar = "";
        billetService.getBilletById(this.route.snapshot.params["billetId"]).subscribe(function (result) {
            _this.billetShipping = result;
            _this.billetShipping.isCancel = false;
            _this.billetShipping.partialPayment = "NAO";
            if (_this.billetShipping !== null && _this.billetShipping !== undefined) {
                clientService.view(_this.billetShipping.clientId).subscribe(function (client) {
                    _this.client = client;
                    // this.generateCodeBarCaixa(this.generateQrCode(this.print()));
                });
            }
        });
    }
    return BilletPaymentComponent;
}());
__decorate([
    core_1.Input()
], BilletPaymentComponent.prototype, "billetShipping", void 0);
__decorate([
    core_1.Input()
], BilletPaymentComponent.prototype, "client", void 0);
BilletPaymentComponent = __decorate([
    core_1.Component({
        selector: 'app-billet-payment',
        templateUrl: './billet-payment.component.html',
        styleUrls: ['./billet-payment.component.css']
    })
], BilletPaymentComponent);
exports.BilletPaymentComponent = BilletPaymentComponent;
//# sourceMappingURL=billet-payment.component.js.map
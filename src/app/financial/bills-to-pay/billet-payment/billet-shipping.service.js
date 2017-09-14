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
var BilletShippingService = (function () {
    function BilletShippingService(http) {
        this.http = http;
        this.urlBilletShipping = 'http://localhost:8080/billet-shipping/';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.params = new http_1.URLSearchParams();
    }
    BilletShippingService.prototype.create = function (billetShipping) {
        return this.http.post(this.urlBilletShipping, billetShipping, { headers: this.headers }).map(function (res) { return res.json(); });
    };
    BilletShippingService.prototype.getLastCounter = function () {
        return this.http.get(this.urlBilletShipping + "last", { headers: this.headers }).map(function (res) { return res.json(); });
    };
    BilletShippingService.prototype.getBilletById = function (billetId) {
        this.params.set('billetId', billetId);
        return this.http.get(this.urlBilletShipping + billetId, { headers: this.headers, search: this.params })
            .map(function (res) { return res.json(); });
    };
    return BilletShippingService;
}());
BilletShippingService = __decorate([
    core_1.Injectable()
], BilletShippingService);
exports.BilletShippingService = BilletShippingService;
//# sourceMappingURL=billet-shipping.service.js.map
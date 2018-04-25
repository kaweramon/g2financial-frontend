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
var BankService = (function () {
    function BankService(http) {
        this.http = http;
        this.urlBank = 'http://localhost:8080/bank/';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.params = new http_1.URLSearchParams();
    }
    BankService.prototype.getBankById = function (bankId) {
        this.params.set('bankId', bankId.toString());
        return this.http.get(this.urlBank + bankId, { headers: this.headers, search: this.params }).map(function (res) { return res.json(); });
    };
    return BankService;
}());
BankService = __decorate([
    core_1.Injectable()
], BankService);
exports.BankService = BankService;
//# sourceMappingURL=bank.service.js.map
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
require("rxjs/add/operator/map");
var ClientService = (function () {
    function ClientService(http) {
        this.http = http;
        this.urlClient = 'http://localhost:8080/client/';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.params = new http_1.URLSearchParams();
    }
    ClientService.prototype.getClientIdByCNPJ = function (cnpj) {
        this.params.set('cnpj', cnpj);
        return this.http.get(this.urlClient, { headers: this.headers, search: this.params }).map(function (res) { return res.json(); });
    };
    ClientService.prototype.view = function (clientId) {
        this.params.set('clientId', clientId.toString());
        return this.http.get(this.urlClient + clientId, { headers: this.headers, search: this.params }).map(function (res) { return res.json(); });
    };
    return ClientService;
}());
ClientService = __decorate([
    core_1.Injectable()
], ClientService);
exports.ClientService = ClientService;
//# sourceMappingURL=client.service.js.map
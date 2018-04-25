"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SearchClientComponent = (function () {
    function SearchClientComponent(clientService, router) {
        this.clientService = clientService;
        this.router = router;
        this.maskCNPJ = [/[0-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/',
            /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
        this.clientCnpj = '';
        this.searchClientError = '';
        this.routerLink = router;
    }
    SearchClientComponent.prototype.searchClient = function () {
        var _this = this;
        this.clientService.getClientIdByCNPJ(this.clientCnpj).subscribe(function (result) {
            _this.routerLink.navigate(['/financeiro', result]);
        }, function (error) {
            _this.searchClientError = error.json().message;
            setTimeout(function () {
                _this.searchClientError = '';
            }, 2000);
        });
    };
    return SearchClientComponent;
}());
SearchClientComponent = __decorate([
    core_1.Component({
        selector: 'app-search-client',
        templateUrl: './search-client.component.html',
        styleUrls: ['./search-client.component.css']
    })
], SearchClientComponent);
exports.SearchClientComponent = SearchClientComponent;
//# sourceMappingURL=search-client.component.js.map
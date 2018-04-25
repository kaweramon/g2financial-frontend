"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var client_1 = require("../search-client/client");
var FinancialComponent = (function () {
    function FinancialComponent(route, router, clientService) {
        this.route = route;
        this.router = router;
        this.clientService = clientService;
        this.client = new client_1.Client();
    }
    FinancialComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.clientService.view(this.route.snapshot.params['clientId']).subscribe(function (result) {
            _this.client = result;
        });
    };
    FinancialComponent.prototype.goToSearchClient = function () {
        this.router.navigate(['/']);
    };
    return FinancialComponent;
}());
FinancialComponent = __decorate([
    core_1.Component({
        selector: 'app-financial',
        templateUrl: './financial.component.html',
        styleUrls: ['./financial.component.css']
    })
], FinancialComponent);
exports.FinancialComponent = FinancialComponent;
//# sourceMappingURL=financial.component.js.map
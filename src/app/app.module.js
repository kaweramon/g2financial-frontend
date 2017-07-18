"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var financial_component_1 = require("./financial/financial.component");
var search_client_component_1 = require("./search-client/search-client.component");
var angular2_text_mask_1 = require("angular2-text-mask");
var app_routes_1 = require("./app.routes");
var client_service_1 = require("./search-client/client.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var bills_to_pay_component_1 = require("./financial/bills-to-pay/bills-to-pay.component");
var paid_bills_component_1 = require("./financial/paid-bills/paid-bills.component");
var bill_to_pay_service_1 = require("./financial/bills-to-pay/bill-to-pay.service");
var ngx_pagination_1 = require("ngx-pagination");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            financial_component_1.FinancialComponent,
            search_client_component_1.SearchClientComponent,
            bills_to_pay_component_1.BillsToPayComponent,
            paid_bills_component_1.PaidBillsComponent
        ],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            angular2_text_mask_1.TextMaskModule,
            ngx_bootstrap_1.TabsModule.forRoot(),
            ngx_pagination_1.NgxPaginationModule,
            app_routes_1.routing
        ],
        providers: [client_service_1.ClientService, bill_to_pay_service_1.BillToPayService],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
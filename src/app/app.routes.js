"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var financial_component_1 = require("./financial/financial.component");
var search_client_component_1 = require("./search-client/search-client.component");
var billet_payment_component_1 = require("./financial/bills-to-pay/billet-payment/billet-payment.component");
var APP_ROUTES = [
    { path: '', component: search_client_component_1.SearchClientComponent },
    // { path: '**', redirectTo: ''},
    { path: 'billet/:billetId', component: billet_payment_component_1.BilletPaymentComponent },
    { path: 'financeiro/:clientId', component: financial_component_1.FinancialComponent }
];
exports.routing = router_1.RouterModule.forRoot(APP_ROUTES);
//# sourceMappingURL=app.routes.js.map
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
var debit_card_payment_component_1 = require("./financial/bills-to-pay/debit-card-payment/debit-card-payment.component");
var credit_card_payment_component_1 = require("./financial/bills-to-pay/credit-card-payment/credit-card-payment.component");
var ng2_toasty_1 = require("ng2-toasty");
var billet_payment_component_1 = require("./financial/bills-to-pay/billet-payment/billet-payment.component");
var type_interest_charge_service_1 = require("./financial/type-interest-charge.service");
var recurrent_payment_component_1 = require("./financial/bills-to-pay/recurrent-payment/recurrent-payment.component");
var bill_to_pay_amounts_paid_service_1 = require("./financial/bills-to-pay/bill-to-pay-amounts-paid.service");
var bill_to_pay_payment_service_1 = require("./financial/bills-to-pay/bill-to-pay-payment.service");
var cielo_payment_service_1 = require("./financial/bills-to-pay/cielo-payment.service");
var ng2_slim_loading_bar_1 = require("ng2-slim-loading-bar");
var billet_shipping_service_1 = require("./financial/bills-to-pay/billet-payment/billet-shipping.service");
var core_2 = require("@angular/core");
var for_sale_component_1 = require("./financial/for-sale/for-sale.component");
var ng2_currency_mask_1 = require("ng2-currency-mask");
var common_1 = require("@angular/common");
var modal_late_billet_component_1 = require("./financial/bills-to-pay/modal-late-billet/modal-late-billet.component");
var bank_service_1 = require("./financial/bills-to-pay/bank.service");
var modal_choose_print_type_component_1 = require("./financial/bills-to-pay/modal-choose-print-type/modal-choose-print-type.component");
var info_billet_late_component_1 = require("./financial/bills-to-pay/info-billet-late/info-billet-late.component");
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
            paid_bills_component_1.PaidBillsComponent,
            debit_card_payment_component_1.DebitCardPaymentComponent,
            credit_card_payment_component_1.CreditCardPaymentComponent,
            billet_payment_component_1.BilletPaymentComponent,
            recurrent_payment_component_1.RecurrentPaymentComponent,
            for_sale_component_1.ForSaleComponent,
            modal_late_billet_component_1.ModalLateBilletComponent,
            modal_choose_print_type_component_1.ModalChoosePrintTypeComponent,
            info_billet_late_component_1.InfoBilletLateComponent
        ],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            common_1.CommonModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpModule,
            angular2_text_mask_1.TextMaskModule,
            ngx_bootstrap_1.TabsModule.forRoot(),
            ngx_pagination_1.NgxPaginationModule,
            app_routes_1.routing,
            ng2_toasty_1.ToastyModule.forRoot(),
            ng2_slim_loading_bar_1.SlimLoadingBarModule.forRoot(),
            ngx_bootstrap_1.ModalModule.forRoot(),
            ng2_currency_mask_1.CurrencyMaskModule
        ],
        providers: [client_service_1.ClientService, bill_to_pay_service_1.BillToPayService, type_interest_charge_service_1.TypeInterestChargeService, bill_to_pay_amounts_paid_service_1.BillToPayAmountsPaidService,
            bill_to_pay_payment_service_1.BillToPayPaymentService, cielo_payment_service_1.CieloPaymentService, billet_shipping_service_1.BilletShippingService, bank_service_1.BankService, { provide: core_2.LOCALE_ID, useValue: 'pt-BR' }],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
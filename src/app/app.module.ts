import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { FinancialComponent } from './financial/financial.component';
import { SearchClientComponent } from './search-client/search-client.component';
import {TextMaskModule} from 'angular2-text-mask';
import {routing} from './app.routes';
import {ClientService} from './search-client/client.service';
import {ModalModule, TabsModule} from 'ngx-bootstrap';
import { BillsToPayComponent } from './financial/bills-to-pay/bills-to-pay.component';
import { PaidBillsComponent } from './financial/paid-bills/paid-bills.component';
import {BillToPayService} from './financial/bills-to-pay/bill-to-pay.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { DebitCardPaymentComponent } from './financial/bills-to-pay/debit-card-payment/debit-card-payment.component';
import { CreditCardPaymentComponent } from './financial/bills-to-pay/credit-card-payment/credit-card-payment.component';
import {ToastyModule} from 'ng2-toasty';
import { BilletPaymentComponent } from './financial/bills-to-pay/billet-payment/billet-payment.component';
import {TypeInterestChargeService} from './financial/type-interest-charge.service';
import { RecurrentPaymentComponent } from './financial/bills-to-pay/recurrent-payment/recurrent-payment.component';
import {BillToPayAmountsPaidService} from './financial/bills-to-pay/bill-to-pay-amounts-paid.service';
import {BillToPayPaymentService} from './financial/bills-to-pay/bill-to-pay-payment.service';
import {CieloPaymentService} from './financial/bills-to-pay/cielo-payment.service';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import {BilletShippingService} from './financial/bills-to-pay/billet-payment/billet-shipping.service';
import { LOCALE_ID } from '@angular/core';
import { ForSaleComponent } from './financial/for-sale/for-sale.component';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {CommonModule} from '@angular/common';
import { ModalLateBilletComponent } from './financial/bills-to-pay/modal-late-billet/modal-late-billet.component';
import {BankService} from './financial/bills-to-pay/bank.service';
import { ModalChoosePrintTypeComponent } from './financial/bills-to-pay/modal-choose-print-type/modal-choose-print-type.component';
import { InfoBilletLateComponent } from './financial/bills-to-pay/info-billet-late/info-billet-late.component';
import { CadG2Service } from './cad-g2/cad-g2.service';

@NgModule({
  declarations: [
    AppComponent,
    FinancialComponent,
    SearchClientComponent,
    BillsToPayComponent,
    PaidBillsComponent,
    DebitCardPaymentComponent,
    CreditCardPaymentComponent,
    BilletPaymentComponent,
    RecurrentPaymentComponent,
    ForSaleComponent,
    ModalLateBilletComponent,
    ModalChoosePrintTypeComponent,
    InfoBilletLateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpModule,
    TextMaskModule,
    TabsModule.forRoot(),
    NgxPaginationModule,
    routing,
    ToastyModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    ModalModule.forRoot(),
    CurrencyMaskModule
  ],
  providers: [ClientService, BillToPayService, TypeInterestChargeService, BillToPayAmountsPaidService,
    BillToPayPaymentService, CieloPaymentService, BilletShippingService, BankService, CadG2Service,
     {provide: LOCALE_ID, useValue: 'pt-BR'}],
  bootstrap: [AppComponent]
})
export class AppModule { }

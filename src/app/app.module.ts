import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    RecurrentPaymentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TextMaskModule,
    TabsModule.forRoot(),
    NgxPaginationModule,
    routing,
    ToastyModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [ClientService, BillToPayService, TypeInterestChargeService, BillToPayAmountsPaidService,
    BillToPayPaymentService, CieloPaymentService, BilletShippingService],
  bootstrap: [AppComponent]
})
export class AppModule { }

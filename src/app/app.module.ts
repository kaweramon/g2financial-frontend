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
import {TabsModule} from 'ngx-bootstrap';
import { BillsToPayComponent } from './financial/bills-to-pay/bills-to-pay.component';
import { PaidBillsComponent } from './financial/paid-bills/paid-bills.component';
import {BillToPayService} from './financial/bills-to-pay/bill-to-pay.service';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    FinancialComponent,
    SearchClientComponent,
    BillsToPayComponent,
    PaidBillsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TextMaskModule,
    TabsModule.forRoot(),
    NgxPaginationModule,
    routing
  ],
  providers: [ClientService, BillToPayService],
  bootstrap: [AppComponent]
})
export class AppModule { }

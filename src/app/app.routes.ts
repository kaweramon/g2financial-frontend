import {RouterModule, Routes} from '@angular/router';
import {FinancialComponent} from './financial/financial.component';
import {ModuleWithProviders} from '@angular/core';
import {SearchClientComponent} from './search-client/search-client.component';
import {BilletPaymentComponent} from './financial/bills-to-pay/billet-payment/billet-payment.component';

const APP_ROUTES: Routes  = [
  { path: '', component: SearchClientComponent},
  // { path: '**', redirectTo: ''},
  { path : 'billet/:billetId', component: BilletPaymentComponent },
  { path: 'financeiro/:clientId', component: FinancialComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);

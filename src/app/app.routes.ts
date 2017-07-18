import {RouterModule, Routes} from '@angular/router';
import {FinancialComponent} from './financial/financial.component';
import {ModuleWithProviders} from '@angular/core';
import {SearchClientComponent} from './search-client/search-client.component';

const APP_ROUTES: Routes  = [
  { path: '', component: SearchClientComponent},
  { path: 'financeiro/:clientId', component: FinancialComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);

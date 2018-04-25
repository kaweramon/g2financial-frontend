import { Injectable } from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {BillToPayPayment} from './bill-to-pay-payment';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BillToPayPaymentService {

  private urlBillToPayPayment = 'http://localhost:8080/bill-to-pay-payment/';
  private urlSandBox = 'https://apisandbox.cieloecommerce.cielo.com.br/1/sales';
  headers = new Headers({ 'Content-Type': 'application/json' });
  private params = new URLSearchParams();

  constructor(private http: Http) { }

  public updateList(listBillToPayPayment: Array<BillToPayPayment>): Observable<BillToPayPayment[]> {
    return this.http.put(this.urlBillToPayPayment + "/list", listBillToPayPayment, {headers: this.headers})
      .map(res => res.json());
  }

}

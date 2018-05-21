import { Injectable } from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CieloPayment} from './cielo-payment';

@Injectable()
export class CieloPaymentService {

  private urlCieloPayment = 'cielo-payment/';
  headers = new Headers({ 'Content-Type': 'application/json' });
  private params = new URLSearchParams();

  constructor(private http: Http) { }

  public create(cieloPayment: CieloPayment, isForSale): Observable<CieloPayment> {
    this.params.set('isForSale', isForSale);
    return this.http.post(this.urlCieloPayment, cieloPayment, {headers: this.headers, search: this.params}).map(res => res.json());
  }

  public getOrderId(): Observable<number> {
    return this.http.get(this.urlCieloPayment + "count-order-id/", {headers: this.headers}).map(res => res.json());
  }

}

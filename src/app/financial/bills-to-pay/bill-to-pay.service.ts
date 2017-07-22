import { Injectable } from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BillToPay} from './bill-to-pay';

@Injectable()
export class BillToPayService {

  private urlBillToPay = 'http://localhost:8080/bill-to-pay/';
  private urlSandBox = 'https://apisandbox.cieloecommerce.cielo.com.br/1/sales';
  headers = new Headers({ 'Content-Type': 'application/json' });
  private params = new URLSearchParams();

  constructor(private http: Http) { }

  public listByClientId(clientId: number, isBillToPay: string): Observable<BillToPay[]> {
    this.params.set('clientId', clientId.toString());
    this.params.set('isBillToPay', isBillToPay);
    return this.http.get(this.urlBillToPay + clientId, {headers: this.headers, search: this.params}).map(res => res.json());
  }

  public paymentCreditCard(payment: any): Observable<any> {
    console.log(payment);
    this.params = new URLSearchParams();
    this.setMerchantIdAndKey();
    return this.http.post(this.urlSandBox, payment, {headers: this.headers, search: this.params}).map(res => res.json());
  }

  public paymentDebitCard(payment: any): Observable<any> {
    this.setMerchantIdAndKey();
    return this.http.post(this.urlSandBox, payment, {headers: this.headers}).map(res => res.json());
  }

  public paymentRecurrentCard(payment: any): Observable<any> {
    this.setMerchantIdAndKey();
    return this.http.post(this.urlSandBox, payment, {headers: this.headers}).map(res => res.json());
  }

  private setMerchantIdAndKey(): void {
    this.headers.set('MerchantId', 'fe17c77b-df00-4ad4-a8e7-378dfc41cf96');
    this.headers.set('MerchantKey', 'TCCBVGXPLLJHJFGQBFPDUWFBNSPLLJTAZAMXJWJK');
  }
}

import { Constants } from './../../util/constants';
import { Injectable } from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BillToPay} from './bill-to-pay';
import {BillToPayPayment} from './bill-to-pay-payment';

@Injectable()
export class BillToPayService {

  private urlBillToPay = Constants.urlEndpoint + 'bill-to-pay/';
  private urlSandBox = 'https://apisandbox.cieloecommerce.cielo.com.br/1/sales';
  private urlSandBoxCard = 'https://apisandbox.cieloecommerce.cielo.com.br/1/card';
  private urlCieloProduction = "https://api.cieloecommerce.cielo.com.br/1/sales/";
  headers = new Headers({ 'Content-Type': 'application/json' });
  private params = new URLSearchParams();

  constructor(private http: Http) { }

  public listByClientId(clientId: number, isBillToPay: string): Observable<BillToPayPayment[]> {
    this.params.set('clientId', clientId.toString());
    this.params.set('isBillToPay', isBillToPay);
    return this.http.get(this.urlBillToPay + clientId, {headers: this.headers, search: this.params})
      .map(res => res.json());
  }

  public paymentCreditCard(payment: any): Observable<any> {
    this.params = new URLSearchParams();
    this.setMerchantIdAndKey();
    this.headers.set("Access-Control-Allow-Origin", "*");
    this.headers.set("Access-Control-Allow-Headers", "content-type, withcredentials, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    this.headers.set("Access-Control-Allow-Credentials", "true");
    this.headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
    return this.http.post(this.urlCieloProduction, payment, {headers: this.headers, search: this.params})
      .map(res => res.json());
  }

  public paymentDebitCard(payment: any): Observable<any> {
    this.params = new URLSearchParams();
    this.setMerchantIdAndKey();
    return this.http.post(this.urlCieloProduction, payment, {headers: this.headers, search: this.params})
      .map(res => res.json());
  }

  public createCardToken(cardTokenRequest: any): Observable<any> {
    this.setMerchantIdAndKey();
    return this.http.post(this.urlSandBoxCard, cardTokenRequest, {headers: this.headers}).map(res => res.json());
  }

  private setMerchantIdAndKey(): void {
    // teste
    /*this.headers.set('MerchantId', 'fe17c77b-df00-4ad4-a8e7-378dfc41cf96');
    this.headers.set('MerchantKey', 'TCCBVGXPLLJHJFGQBFPDUWFBNSPLLJTAZAMXJWJK');*/
    // produção
    this.headers.set('MerchantId', '75668c3e-f66f-41b2-83ef-77f0d94e32f1');
    this.headers.set('MerchantKey', 'KbKRY5d1iNuoTsOgpzKAwuFtfyyET6lIc6QKBvjH');
  }
}

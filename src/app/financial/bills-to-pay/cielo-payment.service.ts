import { Injectable } from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {CieloPayment} from './cielo-payment';

@Injectable()
export class CieloPaymentService {

  private urlCieloPayment = 'http://localhost:8080/cielo-payment/';
  headers = new Headers({ 'Content-Type': 'application/json' });
  private params = new URLSearchParams();

  constructor(private http: Http) { }

  public create(cieloPayment: CieloPayment): Observable<CieloPayment> {
    return this.http.post(this.urlCieloPayment, cieloPayment, {headers: this.headers}).map(res => res.json());
  }

}

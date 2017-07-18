import { Injectable } from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BillToPay} from './bill-to-pay';

@Injectable()
export class BillToPayService {

  private urlBillToPay = 'http://localhost:8080/bill-to-pay/';
  headers = new Headers({ 'Content-Type': 'application/json' });
  private params = new URLSearchParams();

  constructor(private http: Http) { }

  public listByClientId(clientId: number, isBillToPay: string): Observable<BillToPay[]> {
    this.params.set('clientId', clientId.toString());
    this.params.set('isBillToPay', isBillToPay);
    return this.http.get(this.urlBillToPay + clientId, {headers: this.headers, search: this.params}).map(res => res.json());
  }
}

import { Injectable } from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {BillToPayAmountsPaid} from './bill-to-pay-amounts-paid';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BillToPayAmountsPaidService {

  private urlBillToPayAmountPaid = 'http://localhost:8080/bill-to-pay-amounts-paid/';
  headers = new Headers({ 'Content-Type': 'application/json' });
  private params = new URLSearchParams();

  constructor(private http: Http) { }


  public create(billToPayAmountsPaid: BillToPayAmountsPaid): Observable<BillToPayAmountsPaid> {
    return this.http.post(this.urlBillToPayAmountPaid, billToPayAmountsPaid, {headers: this.headers}).map(res => res.json());
  }

  public saveList(listBillToPayAmountsPaid: Array<BillToPayAmountsPaid>): Observable<BillToPayAmountsPaid[]> {
    return this.http.post(this.urlBillToPayAmountPaid + "/list", listBillToPayAmountsPaid, {headers: this.headers})
      .map(res => res.json());
  }

}

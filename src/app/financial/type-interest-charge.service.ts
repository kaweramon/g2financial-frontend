import { Injectable } from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {TypeInterestCharge} from './type-interest-charge';

@Injectable()
export class TypeInterestChargeService {

  private urlTypeInterestBillToPay = 'type-interest/';
  headers = new Headers({ 'Content-Type': 'application/json' });
  private params = new URLSearchParams();

  constructor(private http: Http) { }

  public getByType(type: string): Observable<TypeInterestCharge> {
    this.params.set('type', type);
    return this.http.get(this.urlTypeInterestBillToPay, {search: this.params, headers: this.headers}).map(res => res.json());
  }

}

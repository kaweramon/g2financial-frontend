import { Injectable } from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Bank} from './bank';
import { Constants } from '../../util/constants';

@Injectable()
export class BankService {

  private urlBank = Constants.urlEndpoint + 'bank/';
  headers = new Headers({ 'Content-Type': 'application/json' });
  private params = new URLSearchParams();

  constructor(private http: Http) { }

  public getBankById(bankId: number): Observable<Bank> {
    this.params.set('bankId', bankId.toString());
    return this.http.get(this.urlBank + bankId, {headers: this.headers, search: this.params}).map(res => res.json());
  }

}

import {Injectable} from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Bank} from './bank';

@Injectable()
export class BankService {

  private urlBank = 'http://localhost:8080/bank/';
  headers = new Headers({ 'Content-Type': 'application/json' });
  params: URLSearchParams = new URLSearchParams();

  constructor(private http: Http) { }

  public getByBankNamRem(bankNameRem: string): Observable<Bank> {
    this.params.set('bankNameRem', bankNameRem);
    return this.http.get(this.urlBank, {headers: this.headers, search: this.params}).map(res => res.json());
  }

}

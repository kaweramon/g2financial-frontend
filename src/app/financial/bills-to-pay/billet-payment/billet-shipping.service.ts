import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {BilletShipping} from './billet-shipping';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BilletShippingService {

  private urlBilletShipping = 'http://localhost:8080/billet-shipping/';
  headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  public create(billetShipping: BilletShipping): Observable<BilletShipping> {
    return this.http.post(this.urlBilletShipping, billetShipping, {headers: this.headers}).map(res => res.json());
  }

  public getLastCounter(): Observable<number> {
    return this.http.get(this.urlBilletShipping + "last", {headers: this.headers}).map(res => res.json());
  }

}

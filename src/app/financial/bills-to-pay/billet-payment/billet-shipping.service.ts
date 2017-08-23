import {Injectable} from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {BilletShipping} from './billet-shipping';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BilletShippingService {

  private urlBilletShipping = 'http://localhost:8080/billet-shipping/';
  headers = new Headers({ 'Content-Type': 'application/json' });
  params: URLSearchParams = new URLSearchParams();

  constructor(private http: Http) { }

  public create(billetShipping: BilletShipping): Observable<BilletShipping> {
    return this.http.post(this.urlBilletShipping, billetShipping, {headers: this.headers}).map(res => res.json());
  }

  public getLastCounter(): Observable<number> {
    return this.http.get(this.urlBilletShipping + "last", {headers: this.headers}).map(res => res.json());
  }

  public getByCounter(counter: number): Observable<BilletShipping> {
    this.params.set('counter', counter.toString());
    return this.http.get(this.urlBilletShipping + counter, {headers: this.headers, search: this.params}).map(res => res.json());
  }
}

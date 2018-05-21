import {Injectable} from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {BilletShipping} from './billet-shipping';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BilletShippingService {

  private urlBilletShipping = 'billet-shipping/';
  headers = new Headers({ 'Content-Type': 'application/json' });
  private params = new URLSearchParams();

  constructor(private http: Http) { }

  public create(billetShipping: BilletShipping): Observable<BilletShipping> {
    return this.http.post(this.urlBilletShipping, billetShipping, {headers: this.headers}).map(res => res.json());
  }

  public getLastCounter(): Observable<number> {
    return this.http.get(this.urlBilletShipping + "last", {headers: this.headers}).map(res => res.json());
  }

  public getBilletById(billetId: string): Observable<BilletShipping> {
    this.params.set('billetId', billetId);
    return this.http.get(this.urlBilletShipping + billetId, {headers: this.headers, search: this.params})
      .map(res => res.json());
  }

}

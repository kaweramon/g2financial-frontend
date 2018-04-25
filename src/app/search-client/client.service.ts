import {Injectable} from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Client} from './client';

@Injectable()
export class ClientService {

  private urlClient = 'http://localhost:8080/client/';
  headers = new Headers({ 'Content-Type': 'application/json' });
  private params = new URLSearchParams();

  constructor(private http: Http) { }

  public getClientIdByCNPJ(cnpj: string): Observable<number> {
    this.params.set('cnpj', cnpj);
    return this.http.get(this.urlClient, {headers: this.headers, search: this.params}).map(res => res.json());
  }

  public view(clientId: number): Observable<Client> {
    this.params.set('clientId', clientId.toString());
    return this.http.get(this.urlClient + clientId, {headers: this.headers, search: this.params}).map(res => res.json());
  }

}
